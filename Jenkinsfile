pipeline {
    agent {
        kubernetes {
            cloud "minikube"
            label "shell"
            defaultContainer "shell"
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: shell
    image: docker:24.0.1
    command:
    - cat
    tty: true
  - name: node
    image: node:18-alpine
    command:
    - cat
    tty: true
  - name: dind
    image: docker:24.0.1-dind
    securityContext:
      privileged: true
  volumes:
  - name: docker-graph-storage
    emptyDir: {}
  """
        }
    }
    environment {
   
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // Docker Hub credentials
        DOCKER_IMAGE = "react-app:latest"
        DOCKERHUB_REPO = "selmaguedidi/react-app"
    }
    stages {
        stage('Checkout Code') {
            steps {
                container('shell') {
                    checkout scm
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                container('node') {
                    sh '''
                    npm install
                    '''
                }
            }
        }

        stage('Build React App') {
            steps {
                container('node') {
                    sh '''
                    npm run build
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('shell') {
                    script {
                        sh 'docker info'
                        sh '''
                        docker build -t $DOCKER_IMAGE .
                        '''
                    }
                }
            }
        }

        stage('Tag and Push Docker Image') {
            steps {
                container('shell') {
                    script {
                        sh '''
                        echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                        docker tag $DOCKER_IMAGE $DOCKERHUB_REPO:latest
                        docker push $DOCKERHUB_REPO:latest
                        '''
                    }
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                container('shell') {
                    sh '''
                    kubectl apply -f k8s/deployment.yaml
                    kubectl apply -f k8s/service.yaml
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                container('shell') {
                    sh '''
                    kubectl rollout status deployment/react-app-deployment
                    kubectl get pods
                    '''
                }
            }
        }
    }
}

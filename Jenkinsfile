@Library('my-shared-library@main') _
pipeline {
    agent {
        kubernetes {
            cloud "minikube"
            label "shell"
            defaultContainer "node"
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
    resources:
      limits:
        memory: "2Gi"
        cpu: "1000m"
      requests:
        memory: "500Mi"
        cpu: "500m"
  - name: node
    image: node:18-alpine
    command:
    - cat
    tty: true
    resources:
      limits:
        memory: "2Gi"
        cpu: "1000m"
      requests:
        memory: "500Mi"
        cpu: "500m"
  - name: dind
    image: docker:24.0.1-dind
    securityContext:
      privileged: true
    resources:
      limits:
        memory: "2Gi"
        cpu: "1000m"
      requests:
        memory: "500Mi"
        cpu: "500m"
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
             
                    checkout scm
                
            }
        }

        stage('Install Dependencies') {
            steps {
             
                    sh '''
                    npm install
                    '''
                
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

        stage('Build Docker Image') {
            steps {
                container('shell') {
                    buildDockerImage(DOCKER_IMAGE)
                }
            }
        }

        stage('Tag and Push Docker Image') {
            steps {
                container('shell') {
                    pushDockerImage(DOCKER_IMAGE, DOCKERHUB_REPO)
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                container('shell') {
                    deployToKubernetes('k8s/deployment.yaml', 'k8s/service.yaml')
                }
            }
        }
    }
}

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
    image: docker:27.1.2
    command: ['cat']
    tty: true
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

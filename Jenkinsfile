@Library('my-shared-library@main') _
pipeline {
    agent {
        kubernetes {
            cloud "minikube"
            yamlFile "agents/pod-template.yaml"
            
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
                container('dind') {
                    buildDockerImage(DOCKER_IMAGE)
                }
            }
        }

        stage('Tag and Push Docker Image') {
            steps {
                container('dind') {
                    pushDockerImage(DOCKER_IMAGE, DOCKERHUB_REPO)
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                container('kubectl') {
                    deployToKubernetes('k8s/deployment.yaml', 'k8s/service.yaml', 'react-app-service' , '3000', '80' )
                }
            }
        }
    }
}

@Library('my-shared-library@main') _
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
  - name: kubectl
    image: bitnami/kubectl:latest
    command:
      - "/bin/sh"
      - "-c"
      - "sleep 99d"
    tty: true
    securityContext:
      runAsUser: 0
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
    volumeMounts:
    - name: dockersock
      mountPath: /var/run/docker.sock
  volumes:
  - name: dockersock
    hostPath:
      path: /var/run/docker.sock
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

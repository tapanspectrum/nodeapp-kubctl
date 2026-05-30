pipeline {
    agent any

    environment {
        APP_NAME = "node-app"
        TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Clone') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/tapanspectrum/nodeapp-kubctl.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    set -e
                    IMAGE_NAME="$DOCKER_USER/$APP_NAME"
                    docker build -t "$IMAGE_NAME:$TAG" .
                    '''
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh '''
                    set -e
                    mkdir -p "$WORKSPACE/.docker"
                    export DOCKER_CONFIG="$WORKSPACE/.docker"
                    printf '%s' "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin docker.io
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    set -e
                    export DOCKER_CONFIG="$WORKSPACE/.docker"
                    IMAGE_NAME="$DOCKER_USER/$APP_NAME"
                    docker push "$IMAGE_NAME:$TAG"
                    '''
                }
            }
        }

        stage('Deploy Kubernetes') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    set -e
                    IMAGE_NAME="$DOCKER_USER/$APP_NAME"
                    sed -i "s|YOUR_DOCKERHUB/node-app:latest|$IMAGE_NAME:$TAG|g" k8s/deployment.yaml

                    kubectl apply -f k8s/deployment.yaml
                    kubectl apply -f k8s/service.yaml
                    kubectl apply -f k8s/ingress.yaml
                    '''
                }
            }
        }
    }
}
pipeline {
    agent any

    environment {
        APP_NAME = "node-app"
        IMAGE_NAME = "node-app-image"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/tapanspectrum/nodeapp-kubctl.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t $IMAGE_NAME .
                '''
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                docker rm -f $APP_NAME || true
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                docker run -d \
                  --name $APP_NAME \
                  -p 3000:3000 \
                  $IMAGE_NAME
                '''
            }
        }
    }
}
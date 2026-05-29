pipeline {
    agent any

    environment {
        IMAGE_NAME = "tapu_docker/node-app"
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
                sh 'docker build -t $IMAGE_NAME:$TAG .'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'tapanacharjee',
                    passwordVariable: 'dGFwYW5hY2hhcmplZTpleUpoYkdjaU9pSlNVekkxTmlJc0luUjVjQ0k2SWtwWFZDSXNJbXRwWkNJNkluaFlhM0JDZEROeVYzTXlSeTExWWpsc2NFcG5jU0o5LmV5Sm9kSFJ3Y3pvdkwyaDFZaTVrYjJOclpYSXVZMjl0SWpwN0ltVnRZV2xzSWpvaVlXTm9ZWEpxWldVMU1EWjBZWEJoYmtCbmJXRnBiQzVqYjIwaUxDSnpaWE56YVc5dVgybGtJam9pWVRGalptTm1NREl0WTJJM05DMDBOVGt6TFRrNVkyWXRORGt5T0RjNU9EaGhPRFE1SWl3aWMyOTFjbU5sSWpvaVlYVjBhREFpTENKMWMyVnlibUZ0WlNJNkluUmhjR0Z1WVdOb1lYSnFaV1VpTENKMWRXbGtJam9pWkdaalpXRmtOVEl0WkRFeFpTMDBORFpsTFdKaE4yTXRaak5pWVRka01HSmxPVGN5SW4wc0ltbHpjeUk2SW1oMGRIQnpPaTh2Ykc5bmFXNHVaRzlqYTJWeUxtTnZiUzhpTENKemRXSWlPaUpuYjI5bmJHVXRiMkYxZEdneWZERXhOVE0zTmpBNE16QTVOamd5TmpRek5EUXdNQ0lzSW1GMVpDSTZXeUpvZEhSd2N6b3ZMMmgxWWk1a2IyTnJaWEl1WTI5dElpd2lhSFIwY0hNNkx5OWtiMk5yWlhJdGNISnZaQzUxY3k1aGRYUm9NQzVqYjIwdmRYTmxjbWx1Wm04aVhTd2lhV0YwSWpveE56Z3dNRFkyTmpVeExDSmxlSEFpT2pFM09EQXdOamMxTlRFc0luTmpiM0JsSWpvaWIzQmxibWxrSUc5bVpteHBibVZmWVdOalpYTnpJaXdpWVhwd0lqb2lURFIyTUdSdGJFNUNjRmxWYWtkSFlXSXdRekpLZEdkVVoxaHlNVkY2TkdRaWZRLkhSaTE5bXAwYndSQ0JsVGtXblI5ODdJU2REVVZrRHVhQXRpbktRNGVOanVORUx3cWI5cm5jZWVJZWpmRU96UV9EdTFWZzlQajFKelFicHlRMGVXdGpIWW9scjRBX05fcTV3TGQxMmVJeDNYa2dkVXRPR1d2ZkpNcmtKV3JGN2J3UFBnc21hRDQxWFMxWWRCWWZXVGFHbHExLVFkdjB4M1N5anFEZEs2YmtydDBhZFVNaVpHUXVDZTZzTUNsVS11cjBfVUVVMkRFOHpuZE5WSDBQV1ZKQ2VEY1FLb2RxNDFrNDBWNDFYRDdzeVFvYlNzM0VRaWdrT1FfLXBSSmVTZEtEOU9rTXloTVFmQzlPMmNBU2xrQk1nZ29DYjAtTXFkTEhYSm5FSlF2YlBGVXN3LUctakt1VXVnM3VzSTRwMzIwQVF5ZTlpZTFCTmZ6NU90UlQ4V2hPZw=='
                )]) {

                    sh '''
                    echo $DOCKER_PASS | docker login -u $tapanacharjee --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'docker push $IMAGE_NAME:$TAG'
            }
        }

        stage('Deploy Kubernetes') {
            steps {

                sh '''
                sed -i "s|YOUR_DOCKERHUB/node-app:latest|$IMAGE_NAME:$TAG|g" k8s/deployment.yaml

                kubectl apply -f k8s/deployment.yaml
                kubectl apply -f k8s/service.yaml
                kubectl apply -f k8s/ingress.yaml
                '''
            }
        }
    }
}
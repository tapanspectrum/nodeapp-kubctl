pipeline {
	agent any

	options {
		timestamps()
		disableConcurrentBuilds()
	}

	environment {
		APP_NAME = 'node-app'
		TAG = "${BUILD_NUMBER}"
		K8S_NAMESPACE = 'default'
	}

	stages {
		stage('Checkout') {
			steps {
				git branch: 'main', url: 'https://github.com/tapanspectrum/nodeapp-kubctl.git'
			}
		}

		stage('Install Dependencies') {
			steps {
				sh '''
				set -e
				if [ -f package-lock.json ]; then
				  npm ci
				else
				  npm install
				fi
				'''
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
					docker build -t "$IMAGE_NAME:$TAG" -t "$IMAGE_NAME:latest" .
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
					docker push "$IMAGE_NAME:latest"
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
					cp k8s/deployment.yaml k8s/deployment.ci.yaml
					sed -i "s|YOUR_DOCKERHUB/node-app:latest|$IMAGE_NAME:$TAG|g" k8s/deployment.ci.yaml

					kubectl apply -n "$K8S_NAMESPACE" -f k8s/deployment.ci.yaml
					kubectl apply -n "$K8S_NAMESPACE" -f k8s/service.yaml
					kubectl apply -n "$K8S_NAMESPACE" -f k8s/ingress.yaml
					'''
				}
			}
		}
	}

	post {
		always {
			sh '''
			set +e
			export DOCKER_CONFIG="$WORKSPACE/.docker"
			docker logout docker.io >/dev/null 2>&1 || true
			rm -f k8s/deployment.ci.yaml
			'''
		}
	}
}

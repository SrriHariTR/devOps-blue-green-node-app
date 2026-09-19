pipeline {
    agent any

    environment {
        IMAGE = "srri/blue-green-node-app"
        VERSION = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t %IMAGE%:%VERSION% ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    bat 'docker login -u "%DOCKER_USERNAME%" -p "%DOCKER_PASSWORD%"'
                    bat 'docker push %IMAGE%:%VERSION%'
                    bat 'docker logout'
                }
            }
        }

        stage('Deploy Green') {
            steps {
                bat """
                    docker stop green 2>nul
                    docker rm green 2>nul
                    docker run -d --name green -p 3001:3000 -e VERSION=%VERSION% %IMAGE%:%VERSION%
                """
            }
        }

        stage('Test Green') {
            steps {
                bat "timeout /t 5 /nobreak"
                bat "curl -f http://localhost:3001/"
            }
        }

        stage('Deploy Blue') {
            steps {
                bat """
                    docker stop blue 2>nul
                    docker rm blue 2>nul
                    docker run -d --name blue -p 3000:3000 -e VERSION=%VERSION% %IMAGE%:%VERSION%
                """
            }
        }
    }
}
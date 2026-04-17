pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'eventplanner-basic:latest'
    }
    stages {
        stage('Docker Build & Internal Test') {
            steps {
                dir('EventPlanner-Basic') {
                    // The Dockerfile now handles npm install and npm test internally
                    bat 'docker build -t %DOCKER_IMAGE% .'
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    bat 'docker stop eventplanner-app || ver > nul'
                    bat 'docker rm eventplanner-app || ver > nul'
                    bat 'docker run -d --name eventplanner-app -p 3000:3000 %DOCKER_IMAGE%'
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
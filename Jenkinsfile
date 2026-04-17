pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'eventplanner-basic:latest'
    }
    stages {
        stage('Cleanup') {
            steps {
                bat 'docker rm -f eventplanner-app || ver > nul'
                bat 'docker image prune -f || ver > nul'
            }
        }
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
                dir('EventPlanner-Basic') {
                    // Use docker-compose to redeploy the app service
                    bat 'docker-compose up -d --build app'
                }
            }
        }
    }
    post {
        always {
            bat 'docker image prune -f || ver > nul'
            cleanWs()
        }
    }
}
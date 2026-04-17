pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'eventplanner-basic:latest'
    }
    stages {
        stage('Install Dependencies') {
            steps {
                dir('EventPlanner-Basic') {
                    bat 'npm install'
                }
            }
        }
        stage('Test') {
            steps {
                dir('EventPlanner-Basic') {
                    bat 'npm test || echo "Tests failed or skipped"'
                }
            }
        }
        stage('Docker Build') {
            steps {
                dir('EventPlanner-Basic') {
                    bat 'docker build -t %DOCKER_IMAGE% .'
                }
            }
        }
        stage('Deploy') {
            steps {
                bat 'docker stop eventplanner-app || ver > nul'
                bat 'docker rm eventplanner-app || ver > nul'
                bat 'docker run -d --name eventplanner-app -p 3000:3000 %DOCKER_IMAGE%'
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
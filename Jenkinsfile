pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                dir('EventPlanner-Basic') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('EventPlanner-Basic') {
                    bat 'docker build -t eventplanner-basic:latest .'
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                bat 'docker run -d -p 3000:3000 --name eventplanner-app eventplanner-basic:latest'
            }
        }
    }
}
pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                echo 'Cloning repository...'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('EventPlanner-Basic') {
                    bat 'npm install'
                }
            }
        }

        stage('Run Application') {
            steps {
                dir('EventPlanner-Basic') {
                    bat 'npm start'
                }
            }
        }

    }
}
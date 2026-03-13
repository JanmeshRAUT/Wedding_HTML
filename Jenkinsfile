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

        stage('Build Complete') {
            steps {
                echo 'Application built successfully'
            }
        }

    }
}
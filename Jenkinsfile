pipeline {
    agent any

    environment {
        REGISTRY = "jmmunozpu"  
        APP_NAME = "prueba"
    }

    stages {
        stage('Clonar Repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/jumunozdev/integracion.git'
            }
        }

        stage('Compilar Backend') {
            steps {
                bat '''
                cd Backend/apirest
                mvnw.cmd clean package -DskipTests
                '''
            }
        }

        stage('Construir Backend') {
            steps {
                bat 'docker build -t %REGISTRY%/%APP_NAME%-backend:latest -f Backend/apirest/Dockerfile Backend/apirest'
            }
        }

        stage('Construir Frontend') {
            steps {
                bat 'docker build -t %REGISTRY%/%APP_NAME%-frontend:latest -f Frontend/front/Dockerfile Frontend/front'
            }
        }

        stage('Subir a Registro') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-credentials', url: 'https://index.docker.io/v1/']) {
                    bat 'docker push %REGISTRY%/%APP_NAME%-backend:latest'
                    bat 'docker push %REGISTRY%/%APP_NAME%-frontend:latest'
                }
            }
        }

        stage('Desplegar en Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kube-config', variable: 'KUBECONFIG')]) {
                    bat 'kubectl apply -f k8s/'
                    }
             }
        }
    }
}

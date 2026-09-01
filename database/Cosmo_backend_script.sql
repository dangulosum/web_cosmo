#------------------------------------------------------------------------------
#I. CREACION DE DATA BASE GENERAL
#------------------------------------------------------------------------------

CREATE DATABASE IF NOT EXISTS cosmo_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE cosmo_db;

#------------------------------------------------------------------------------
#II.CREACION DE TABLAS
#------------------------------------------------------------------------------

#2.1. CREACION DE TABLA DE EQUIPO
CREATE TABLE IF NOT EXISTS miembros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    rol VARCHAR(100) NOT NULL,
    biografia TEXT,
    imagen_url VARCHAR(255) DEFAULT 'images/equipo/default.png',
    cv_lattes VARCHAR(255),
    orcid VARCHAR(255),
    orden INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

#2.2. CREAR TABLA DE PROYECTOS
CREATE TABLE IF NOT EXISTS proyectos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    estado ENUM('Publicado', 'En Curso', 'En Revisión') DEFAULT 'Publicado',
    investigadores TEXT NOT NULL,
    resumen TEXT NOT NULL,
    doi_url VARCHAR(255),
    imagen_url VARCHAR(255) DEFAULT 'images/test_article.png',
    destacado BOOLEAN DEFAULT FALSE,
    fecha_publicacion DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

#2.3. CREAR TABLA DE AREAS DE PESQUISA
CREATE TABLE IF NOT EXISTS areas_pesquisa (
	id INT AUTO_INCREMENT PRIMARY KEY,
	area_pesquisa VARCHAR(50) NOT NULL,
	img_area VARCHAR(255) DEFAULT 'images/panel.png',
	description_area TEXT NOT NULL,
	estado_area ENUM('Activo', 'Inactivo') DEFAULT 'Activo'
) ENGINE=InnoDB;

#------------------------------------------------------------------------------
#III.INSERCION DE CONTENIDO EN TABLAS
#------------------------------------------------------------------------------

#3.1. CARGA DE MIEMBROS
INSERT INTO miembros (nombre, rol, biografia, imagen_url, cv_lattes, orcid, orden) VALUES
('Jalmar Carrasco', 'Profesor Lider / Investigador', 'Especialista en análisis cuantitativo y modelado estadístico aplicado a problemas complejos de datos.', 'images/equipo/Jalmar_Carrasco.png', '#', '#', 1),
('Lizandra Fabio', 'Investigadora Principal', 'Investigadora enfocada en metodologías computacionales y procesamiento analítico de información.', 'images/equipo/Lizandra_Fabio.jpg', '#', '#', 2),
('Lucas Vieira', 'Investigador', 'Desarrollador de modelos de aprendizaje automático y análisis exploratorio de datos multidimensionales.', 'images/equipo/Lucas_Vieira.png', '#', '#', 3),
('Cristian', 'Investigador', 'Especializado en técnicas de inferencia y optimización para la resolución de algoritmos complejos.', 'images/equipo/Cristian.png', '#', '#', 4),
('Sandro Lins', 'Investigador', 'Investigador en métodos estadísticos avanzados y gestión de proyectos de investigación aplicada.', 'images/equipo/Sandro_Lins.jpg', '#', '#', 5);

#3.2. CARGA DE PROYECTOS
INSERT INTO cosmo_db.proyectos (titulo, estado, investigadores, resumen, doi_url, imagen_url, destacado) VALUES
(
    'Bivariate Simplex Distribution', 
    'Publicado', 
    'Emerson Alves; Lucas Vieira; Lizandra Fabio; Vanessa Barros; Jalmar Carrasco', 
    'Este artículo introduce una distribución Simplex bivariada construida mediante funciones cópula, en particular la cópula de Farlie–Gumbel–Morgenstern (FGM), para modelar datos continuos acotados en el intervalo unitario. El modelo propuesto permite estructuras de dependencia flexibles conservando la tractabilidad analítica. Se desarrollan procedimientos de estimación por máxima verosimilitud y se realizan estudios de simulación extensivos para evaluar el desempeño de los estimadores bajo distintos escenarios. Las aplicaciones a datos reales, incluyendo prevalencia de trastornos de salud mental e indicadores jurimétricos, ilustran la adecuación e interpretabilidad del marco Simplex bivariado propuesto.', 
    'https://revistas.unal.edu.co/index.php/estad/article/view/118380', 
    'images/test_article_2.png',
    TRUE
),
(
    'Residual analysis for discrete correlated data in the multivariate approach', 
    'Publicado', 
    'Lizandra C. Fábio; Cristian Villegas; Abu Sayed Md. Al Mamun; Jalmar Manuel Farfan Carrasco', 
    'The residual distributions obtained from discrete correlated and uncorrelated data cannot be well approximated to the standardized normal distribution. In this case, the efficiency in checking the adequacy of the model to the data and detecting outliers is not guaranteed. Thus, alternative measures for residual analysis have been considered in several classes of models and their properties have been assessed. In this paper, we investigate the empirical distribution of four residuals of the multivariate negative binomial regression (MNBR) model. In our study, we propose standardized weighted and standardized Pearson residuals; we also consider the standardized component of deviance and quantile residuals suggested by Fabio et al. (2012) and Fabio et al. (2023), respectively.', 
    'https://doi.org/10.28951/bjb.v43i1.728', 
    'images/test_article.png',
    FALSE
);

#3.3. CARGAR DE AREAS DE PEQUISA
INSERT INTO cosmo_db.areas_pesquisa (area_pesquisa, img_area, description_area, estado_area)
VALUES(
	'Modelos Lineares Generalizados Mistos (GLMM)', 'images/panel.png' , 'Desarrollo de técnicas para analizar datos con estructuras complejas, incorporando efectos fijos y aleatorios para capturar la variabilidad en poblaciones heterogéneas' , 'Activo'
),
(	
	'Modelos de Regressão com Erros de Medida', 'images/panel.png', 'Metodologías diseñadas para corregir sesgos y mejorar la precisión de las predicciones cuando las variables explicativas presentan fallas o imprecisiones en su recolección' , 'Activo'
),
(
	'Análise de Sobrevivência' , 'images/panel.png' , 'Modelado estadístico del tiempo hasta la ocurrencia de un evento, esencial en estudios médicos, de confiabilidad industrial y ciencias sociales' , 'Activo'
),
(
	'Estatística Computacional' , 'images/panel./png' , 'Aplicación de algoritmos intensivos y simulación numérica para resolver modelos que no tienen soluciones analíticas directas, optimizando procesos de inferencia' , 'Activo'
);








#OTRAS ACCIONES A MEDIDA


#SELECCIONAR LA TABLA MIEMBROS
SELECT * FROM cosmo_db.miembros

#SELECCIONAR LA TABLA PROYECTOS
SELECT * FROM cosmo_db.proyectos 

#SELECCIONAR LA TABLA AREAS PESQUISA
SELECT * FROM cosmo_db.areas_pesquisa ap 

#CREAR NUEVO PROYECTO
INSERT INTO cosmo_db.miembros (nombre, rol, biografia, imagen_url, cv_lattes, orcid, orden) VALUES
('Investigador prueba 2' , 'Prueba' , 'Especialista en desarrollo web y gobierno de datos' , 'images/equipo/usuario.png' , '#' , '#' , 6);

#AGREGAR COLUMNA - TABLA PROYECTOS
ALTER TABLE cosmo_db.proyectos ADD index_impacto ENUM('Q1', 'Q2' , 'Q3' , 'Q4') DEFAULT NULL;




# Project: Police vs. Thieves: Capture the Diamonds

This proyect is a real-time multiplayer game where players are divided into two teams: police and thieves. The objective is to win the match by either eliminating players from the opposing team by handcuffing them (in the case of the police) or capturing the majority of the diamonds located on the track (in the case of the thieves). The game takes place in an obstacle-filled environment.

### Key Features
- **Real-time Multiplayer:** Support for N players divided into two teams.
- **Team Division:** Random or player-selected team assignments.
- **Obstacle-filled Environment:** Track with indestructible obstacles where players can take cover.
- **Eliminations:** Players can handcuff thieves a maximum of 3 times per thief to eliminate opponents, which gives points.
- **Diamond Capture:** Thieves can win by capturing the diamonds on the track, which gives points.
- **Winning the Match:** Thieves can win by capturing the diamonds on the track and police by capturing all the thieves, both within a time limit.
- **Scoring and Ranking System:** Record of player scores and rankings.
## Starting

In order to use the project on your system, you can access the following link and download a compressed file of it.

[Repository](https://github.com/Richi025/police-vs-thieves.git) 

You can also clone the file using the following command.

```
git clone https://github.com/Richi025/police-vs-thieves.git  
```

### Previous requirements

It is necessary to have "**Maven**", "**Java**", "**Node.js**" installed, preferably in their latest versions.

#### Maven
```
Download Maven at http://maven.apache.org/download.html 

Follow the instructions at http://maven.apache.org/download.html#Installation
```
#### Java

```
Download Java at https://www.java.com/es/download/ie_manual.jsp
```

#### Node.js

```
Download Node.js at https://nodejs.org/en
```

### Installing

Once you have the cloned project in your repository. Follow the steps below to launch the program successfully.

#### Run BackEnd Spring-boot

**The application is being implemented**

1. Open a terminal and enter the folder where I clone the repository and enter the BoardSpring folder.

2. Use the following command to compile and clean the target directory.
    ```
    mvn clean compile
    ```
3. Now use the following command to package the project as a JAR file.

    ```
    mvn package
    ```

4. Now you can run the project using the following command.

    ```
    mvn spring-boot:run

    Now the server is running.
    ```

#### Run FrontEnd React Js

1. Open a terminal and enter the folder where I clone the repository and enter the BoardReact folder.

2. Use the following command to install dependencies
    ```
    npm install
    ```
3. Now use the following command start proyect

    ```
    npm start
    ```

4. Now there will be a browser and enter the following link and you can start drawing.

    http://localhost:3000/ 

    ![alt text](image.png)

## Proyect Structure

### Run BackEnd Spring-boot 

**The application is being implemented**

- SpringApplication.java : Main application class for the Spring Boot application.

- Controller: 

   - REST controller for handling mouse movement data.

- Model: 

    - Represents a mouse movement data object.

### Run FrontEnd React Js

**The application is being implemented**



#### Server (API):



## Architectural Design

**The application is being implemented**

![alt text](images/imageDesing.png)


### Data Flow

**The application is being implemented**

## AWS

**The application is being implemented**

## Built with

* [Maven](https://maven.apache.org/) - Dependency management
* [java](https://www.java.com/es/) - Programming language
* [Spring boot](https://start.spring.io/) - Framework

### Technologies Used
+ **Java:** Programming language.
+ **Spring Boot:** Framework for building the application.
+ **React:** Is an open source Javascript library designed for creating user interfaces.

## Versioned

We use [Git](https://github.com/) for version control. For available versions, see the tags in this repository.

## Authors

* **Jose Ricardo Vasquez Vega** - [Richi025](https://github.com/Richi025)

## Date

Friday, June 28, 2024

## License

This project is licensed under the GNU license; See the [LICENSE.txt](LICENSE.txt) file for details.
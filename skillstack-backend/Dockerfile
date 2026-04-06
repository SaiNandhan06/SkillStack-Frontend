FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY . .

RUN chmod +x mvnw

# 🔥 Build JAR properly
RUN ./mvnw clean package -DskipTests

# 🔍 Debug (optional but helpful)
RUN ls target

CMD ["sh", "-c", "java -jar target/*.jar"]
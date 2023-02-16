plugins {
    kotlin("jvm") version "1.8.0"
}

group = "ru.nb.medalist"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(8)
}
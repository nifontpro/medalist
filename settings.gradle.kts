rootProject.name = "medalist"

pluginManagement {
	plugins {
		val kotlinVersion: String by settings
		val springBootVersion: String by settings
		val springDependencyVersion: String by settings

		kotlin("jvm") version kotlinVersion apply false
		kotlin("plugin.spring") version kotlinVersion apply false
		id("org.springframework.boot") version springBootVersion apply false
		id("io.spring.dependency-management") version springDependencyVersion apply false
	}
}

include("cor")
include("frontbff")
include("msm-config")
include("msm-config")
include("msm-gateway")
include("msm-server")
include("msm-user")
include("proxy-bff")

include("ms-user")
include("ms-user:rest")
include("ms-user:rest:domain")
include("ms-user:domain")
include("ms-user:db")
include("ms-user:di")

package ru.nb.medalist.base

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.ComponentScan

@SpringBootApplication
//@ComponentScan(basePackages = ["ru.nb.medalist"])
class MsUserApplication

fun main(args: Array<String>) {
	runApplication<MsUserApplication>(*args)
}

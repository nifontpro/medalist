package ru.nb.medalist.base.utils

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.stereotype.Component
import java.util.*
import javax.naming.AuthenticationException

@JsonIgnoreProperties(ignoreUnknown = true)
data class AuthData(
	val sub: String = "",
	@JsonProperty("email_verified") val emailVerified: Boolean = false,
	@JsonProperty("given_name") val givenName: String = "",
	@JsonProperty("family_name") val familyName: String = "",
	val name: String = "",
	val email: String = "",
)

@Component
class JwtUtils {

	val decoder: Base64.Decoder = Base64.getUrlDecoder()
	val mapper = jacksonObjectMapper()

	fun decodeBearerJwt(bearerToken: String): AuthData {
		val token = if (bearerToken.startsWith("Bearer ")) {
			bearerToken.substring(7)
		} else {
			throw AuthenticationException()
		}
		val chunks = token.split(".")
		if (chunks.size != 3) throw AuthenticationException()
		val payload = decoder.decode(chunks[1]).toString(Charsets.UTF_8)
		return mapper.readValue(payload)
	}
}
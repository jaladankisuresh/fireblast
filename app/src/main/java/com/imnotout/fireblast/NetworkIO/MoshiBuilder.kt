package com.imnotout.fireblast.NetworkIO

import com.squareup.moshi.Moshi
import com.squareup.moshi.FromJson
import com.squareup.moshi.JsonAdapter
import java.lang.reflect.Type

class JsonBuilder {
    companion object {
        val instance: Moshi by lazy {
            Moshi.Builder()
                /* Add the KotlinJsonAdapterFactory last to allow other installed Kotlin type factories to be used,
                since factories are called in order. */
//                .add(KotlinJsonAdapterFactory())
                .build()
        }
        inline fun<reified T> toJson(model: T): String = jsonAdapter<T>().toJson(model)
        inline fun<reified T> fromJson(modelJson: String): T = jsonAdapter<T>().fromJson(modelJson)!!
        inline fun<reified T> jsonAdapter(): JsonAdapter<T> {
            val mClazz: Type = T::class.java
            return instance.adapter<T>(mClazz)
        }
    }
}



package com.imnotout.app.JavaScriptBridge

import com.eclipsesource.v8.*
import com.google.firebase.database.*
import com.imnotout.fireblast.JS
import com.imnotout.fireblast.AndroidApplication.Companion.jsRuntime
import com.imnotout.fireblast.NetworkIO.JsonBuilder
import kotlinx.coroutines.experimental.async



sealed class JsFirebaseUtil {
    companion object {
        fun registerUtilFunctions(runtime: V8) {
//            using a temporary jFirebase javascript object to ease testing from javascript.
//            In production, this is to be replaced with fbApi
//            val v8FBObject = runtime.getObject("fbApi")
            val v8jFBObject = V8Object(runtime)
            runtime.add("jFirebase", v8jFBObject)
            v8jFBObject.registerJavaMethod(FirebaseDB, "set", "set",
                    arrayOf<Class<*>>(String::class.java, String::class.java, String::class.java))
            v8jFBObject.registerJavaMethod(FirebaseDB, "update", "update",
                    arrayOf<Class<*>>(String::class.java, String::class.java, String::class.java))
            v8jFBObject.registerJavaMethod(FirebaseDB, "push", "push",
                    arrayOf<Class<*>>(String::class.java, String::class.java, String::class.java))
            v8jFBObject.registerJavaMethod(FirebaseDB, "get", "get",
                    arrayOf<Class<*>>(String::class.java, String::class.java))
            v8jFBObject.registerJavaMethod(FirebaseDB, "remove", "remove",
                    arrayOf<Class<*>>(String::class.java, String::class.java))
            v8jFBObject.registerJavaMethod(FirebaseDB, "increment", "increment",
                    arrayOf<Class<*>>(String::class.java, String::class.java))
            v8jFBObject.registerJavaMethod(FirebaseDB, "decrement", "decrement",
                    arrayOf<Class<*>>(String::class.java, String::class.java))
            v8jFBObject.registerJavaMethod(FirebaseDB, "registerForChildAdded", "onChildAdded",
                    arrayOf<Class<*>>(String::class.java, String::class.java))
            v8jFBObject.registerJavaMethod(FirebaseDB, "unregisterForChildAdded", "offChildAdded",
                    arrayOf<Class<*>>(String::class.java, String::class.java))
            v8jFBObject.registerJavaMethod(FirebaseDB, "on", "on",
                    arrayOf<Class<*>>(String::class.java, String::class.java))
            v8jFBObject.registerJavaMethod(FirebaseDB, "off", "off",
                    arrayOf<Class<*>>(String::class.java, String::class.java))
            v8jFBObject.release()
        }
    }

    object FirebaseDB {
        val runtime = jsRuntime
        val fireDB = FirebaseDatabase.getInstance().getReference()
        val valueEventListeners = HashMap<String, ValueEventListener>()
        val childAddedEventListeners = HashMap<String, ChildEventListener>()

        fun set(token: String, path: String, value: String) {
            val number = value.toIntOrNull()
            val setVal = if(number == null) value else number
            fireDB.child(path).setValue(setVal,
                    object : DatabaseReference.CompletionListener {
                        override fun onComplete(err: DatabaseError?, data: DatabaseReference) {
                            err?.let { onErrorResponse(token, err.message) } ?: onSuccessResponse(token, value)
                        }
                    })
        }
        fun update(token: String, path: String, json: String) {
            val jsonMap = JsonBuilder.fromJson<Map<String, Any>>(json)
            fireDB.child(path).updateChildren(jsonMap,
                    object : DatabaseReference.CompletionListener {
                        override fun onComplete(err: DatabaseError?, data: DatabaseReference) {
                            err?.let { onErrorResponse(token, err.message) } ?: onSuccessResponse(token, json)
                        }
                    })
        }
        fun push(token: String, path: String, json: String) {
            val key = fireDB.child(path).push().key
            update(token, "${path}/${key}", json)
        }
        fun get(token: String, path: String) {
            fireDB.child(path)
                .addListenerForSingleValueEvent(object : ValueEventListener {
                    override fun onDataChange(data: DataSnapshot) = onSuccessResponse(token, data.value.toString())
                    override fun onCancelled(err: DatabaseError) = onErrorResponse(token, err.message)
                })
        }
        fun remove(token: String, path: String) {
            fireDB.child(path).removeValue(object : DatabaseReference.CompletionListener {
                override fun onComplete(err: DatabaseError?, data: DatabaseReference) {
                    err?.let { onErrorResponse(token, err.message) } ?: onSuccessResponse(token, "")
                }
            })
        }
        fun increment(token: String, path: String) = updateCounter(token, path, 1)
        fun decrement(token: String, path: String) = updateCounter(token, path, -1)
        private fun updateCounter(token: String, path: String, step: Int) {
            fireDB.child(path).runTransaction(object: Transaction.Handler {
                override fun doTransaction(data: MutableData): Transaction.Result {
//              Note: Because doTransaction() is called multiple times, it must be able to handle null data.
//              Even if there is existing data in your remote database, it may not be locally cached when the transaction
//              function is run, resulting in null for the initial value.
                    if (data.value == null) return Transaction.success(data)
                    val value = data.getValue(Int::class.java)!!
                    data.value = value + step
                    return Transaction.success(data)
                }
                override fun onComplete(err: DatabaseError?, p1: Boolean, data: DataSnapshot?) =
                        err?.let { onErrorResponse(token, err.message) } ?:
                        onSuccessResponse(token, data?.value.toString())
            })
        }
        fun registerForChildAdded(token: String, path: String) {
            val childAddedEventListener = object: ChildEventListener {
                override fun onChildAdded(data: DataSnapshot, previousChildName: String?) =
                        onSuccessResponse(token, data.value.toString())
                override fun onCancelled(err: DatabaseError) = onErrorResponse(token, err.message)
                override fun onChildMoved(data: DataSnapshot?, p1: String?) { }
                override fun onChildChanged(data: DataSnapshot?, p1: String?) { }
                override fun onChildRemoved(data: DataSnapshot?) { }
            }
//            limitToLast(1) may not be necessary in our actual use case. implemented it for ease of testing
            fireDB.child(path).addChildEventListener(childAddedEventListener)
            childAddedEventListeners.put(path, childAddedEventListener)
        }
        fun unregisterForChildAdded(token: String, path: String) {
            try{
                val childAddedEventListener = childAddedEventListeners.get(path)
                fireDB.child(path).removeEventListener(childAddedEventListener)
                childAddedEventListeners.remove(path)
                onSuccessResponse(token, "")
            }
            catch (ex: Exception) {
                onErrorResponse(token, ex.message!!)
            }
        }
        fun on(token: String, path: String) {
            val valueChangeEventListener = object : ValueEventListener {
                override fun onDataChange(data: DataSnapshot) = onSuccessResponse(token, data.value.toString())
                override fun onCancelled(err: DatabaseError) = onErrorResponse(token, err.message)
            }
            fireDB.child(path).addValueEventListener(valueChangeEventListener)
            valueEventListeners.put(path, valueChangeEventListener)
        }

        fun off(token: String, path: String) {
            try{
                val valueEventListener = valueEventListeners.get(path)
                fireDB.child(path).removeEventListener(valueEventListener)
                valueEventListeners.remove(path)
                onSuccessResponse(token, "")
            }
            catch (ex: Exception) {
                onErrorResponse(token, ex.message!!)
            }
        }
        fun onSuccessResponse(token: String, data: String) {
            async(JS) {
                val v8FBObject = runtime.getObject("fbApi")
                val onResponseParams = V8Array(runtime).push(token).push(data)
                v8FBObject.executeVoidFunction("onSuccessResponse", onResponseParams)
                v8FBObject.release()
            }
        }
        fun onErrorResponse(token: String, err: String) {
            async(JS) {
                val v8FBObject = runtime.getObject("fbApi")
                val onResponseParams = V8Array(runtime).push(token).push(err)
                v8FBObject.executeVoidFunction("onErrorResponse", onResponseParams)
                v8FBObject.release()
            }
        }
    }

}

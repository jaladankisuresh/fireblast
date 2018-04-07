package com.imnotout.fireblast

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.TextView
import com.google.firebase.database.*
import com.imnotout.app.JavaScriptBridge.JsFirebaseUtil
import kotlinx.android.synthetic.main.activity_main.*


class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val fireDB = FirebaseDatabase.getInstance().getReference()
//        btn_get.setOnClickListener {
//            JsFirebaseUtil.FirebaseDB.get("12345", "establishments/6/comments")
//        }
//        btn_set.setOnClickListener {
//            JsFirebaseUtil.FirebaseDB.set("12345", "establishments/6/comments/0", "{id=14, text=Fourten}")
//        }
//        btn_update.setOnClickListener {
//            JsFirebaseUtil.FirebaseDB.update("12345", "establishments/6/comments", """{"0": {"id":14, "text":"Fourteeen"}}""")
//        }
        btn_append.setOnClickListener {
            val comments = fireDB.child("establishments/6/comments")
            val newItemKey = comments.push().key

            val childUpdates = HashMap<String, Any>()
            childUpdates.put("/" + newItemKey, txt_fb_value.text.toString())
            comments.updateChildren(childUpdates,
                    object : DatabaseReference.CompletionListener {
                        override fun onComplete(err: DatabaseError?, ref: DatabaseReference) {
                            err?.let { Log.w(LOG_APP_TAG, "updateChildren:DatabaseError", err.toException()) }
                        }
                    })
        }
        val childAddedEventListener = object: ChildEventListener {
            override fun onChildAdded(data: DataSnapshot, previousChildName: String?) {
                txt_fb_child_data.setText(data.value.toString(), TextView.BufferType.EDITABLE)
            }
            override fun onCancelled(err: DatabaseError?) {
                TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
            }
            override fun onChildMoved(data: DataSnapshot?, p1: String?) {
                TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
            }
            override fun onChildChanged(data: DataSnapshot?, p1: String?) {

            }
            override fun onChildRemoved(data: DataSnapshot?) {
                TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
            }
        }
//        fireDB.child("establishments/6/comments").addChildEventListener(childAddedEventListener)
//        fireDB.child("establishments/6/comments").removeEventListener(childAddedEventListener)
    }
}

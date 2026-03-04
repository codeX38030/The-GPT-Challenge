# farmphile AI ProGuard Rules

# TensorFlow Lite
-keep class org.tensorflow.** { *; }
-keep class org.tensorflow.lite.** { *; }
-keepclassmembers class org.tensorflow.lite.** { *; }

# AnyWhere SDK
-keep class com.runanywhere.** { *; }
-keepclassmembers class com.runanywhere.** { *; }

# Room Database
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class *
-keep @androidx.room.Dao class *

# Hilt
-keep class dagger.hilt.** { *; }
-keepclassmembers class ** {
    @dagger.hilt.android.lifecycle.HiltViewModel *;
}

# Kotlin Coroutines
-keepclassmembernames class kotlinx.** {
    volatile <fields>;
}

# Keep app classes
-keep class com.farmphile.ai.** { *; }
-keepclassmembers class com.farmphile.ai.** { *; }

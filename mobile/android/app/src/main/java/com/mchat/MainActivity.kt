package com.mchat

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    override fun getMainComponentName(): String = "MChat"

    /**
     * Displays the splash screen on app launch.
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        SplashScreen.show(this)  // Show the splash screen once at startup
        super.onCreate(savedInstanceState)
    }

    /**
     * Returns the instance of the [ReactActivityDelegate].
     * Uses [DefaultReactActivityDelegate] to manage React Native settings.
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
    }
}

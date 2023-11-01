package com.idwisereactnativesample;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class IDWiseModule extends ReactContextBaseJavaModule {

    ReactApplicationContext context;

    IDWiseModule(ReactApplicationContext context) {
        super(context);
        this.context = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "IDWiseModule";
    }
}

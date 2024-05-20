package com.idwisereactnativesample;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.idwise.sdk.IDWise;
import com.idwise.sdk.IDWiseSDKCallback;
import com.idwise.sdk.data.models.IDWiseSDKError;
import com.idwise.sdk.data.models.IDWiseSDKTheme;
import com.idwise.sdk.data.models.JourneyInfo;

import kotlin.Unit;
import kotlin.jvm.functions.Function1;

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


    /**
     * this function is used to send back the events related to Verification
     * Journey, to the JavaScript interface
     */

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void initialize(String clientKey, String theme) {
        IDWiseSDKTheme idwiseTheme;
        try {
            idwiseTheme = IDWiseSDKTheme.valueOf(theme);
        } catch (Exception e) {
            idwiseTheme = IDWiseSDKTheme.SYSTEM_DEFAULT;
        }

        Function1<? super IDWiseSDKError, Unit> errorCallback = (Function1<IDWiseSDKError, Unit>) error -> {

            WritableMap params = Arguments.createMap();
            params.putInt("errorCode", error.getErrorCode());
            params.putString("errorMessage", error.getMessage());
            sendEvent("onError", params);

            return null;
        };

        IDWise.INSTANCE.initialize(clientKey, idwiseTheme, errorCallback);
    }

    @ReactMethod
    public void startJourney(String journeyTemplateId,
                             String referenceNo,
                             String locale) {


        IDWiseSDKCallback callback = new IDWiseSDKCallback() {
            @Override
            public void onJourneyStarted(@NonNull JourneyInfo journeyInfo) {
                WritableMap params = Arguments.createMap();
                params.putString("journeyId", journeyInfo.getJourneyId());
                sendEvent("onJourneyStarted", params);
            }

            @Override
            public void onJourneyResumed(@NonNull JourneyInfo journeyInfo) {
                WritableMap params = Arguments.createMap();
                params.putString("journeyId", journeyInfo.getJourneyId());
                sendEvent("onJourneyResumed", params);
            }

            @Override
            public void onJourneyCompleted(@NonNull JourneyInfo journeyInfo, boolean isCompleted) {
                WritableMap params = Arguments.createMap();
                params.putString("journeyId", journeyInfo.getJourneyId());
                sendEvent("onJourneyFinished", params);
            }

            @Override
            public void onJourneyCancelled(@Nullable JourneyInfo journeyInfo) {
                WritableMap params = Arguments.createMap();
                params.putString("journeyId", journeyInfo == null ? null : journeyInfo.getJourneyId());
                sendEvent("onJourneyCancelled", params);
            }

            @Override
            public void onError(@NonNull IDWiseSDKError idWiseSDKError) {

                WritableMap params = Arguments.createMap();
                params.putInt("errorCode", idWiseSDKError.getErrorCode());
                params.putString("errorMessage", idWiseSDKError.getMessage());
                sendEvent("onError", params);

            }
        };

        IDWise.INSTANCE.startJourney(
                getCurrentActivity(),
                journeyTemplateId,
                referenceNo,
                locale,
                callback
        );
    }


}

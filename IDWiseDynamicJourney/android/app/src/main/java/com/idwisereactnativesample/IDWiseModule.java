package com.idwisereactnativesample;

import android.graphics.Bitmap;
import android.util.Base64;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;
import com.idwise.sdk.IDWise;
import com.idwise.sdk.IDWiseSDKCallback;
import com.idwise.sdk.IDWiseSDKStepCallback;
import com.idwise.sdk.data.models.IDWiseSDKError;
import com.idwise.sdk.data.models.IDWiseSDKTheme;
import com.idwise.sdk.data.models.JourneyInfo;
import com.idwise.sdk.data.models.StepResult;

import java.io.ByteArrayOutputStream;

import kotlin.Unit;
import kotlin.jvm.functions.Function1;

public class IDWiseModule extends ReactContextBaseJavaModule {

    ReactApplicationContext context;
    IDWiseSDKCallback journeyCallback;
    IDWiseSDKStepCallback stepCallback;

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
    public void initializeSDK(String clientKey, String theme) {
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
    public void startDynamicJourney(String journeyTemplateId,
                                    String referenceNo,
                                    String locale) {
        setJourneyCallback();
        setStepCallback();

        IDWise.INSTANCE.startDynamicJourney(
                getCurrentActivity(),
                journeyTemplateId,
                referenceNo,
                locale,
                journeyCallback,
                stepCallback
        );
    }

    @ReactMethod
    public void resumeDynamicJourney(String journeyTemplateId,
                                     String referenceNo,
                                     String locale) {
        setJourneyCallback();
        setStepCallback();

        IDWise.INSTANCE.resumeDynamicJourney(
                getCurrentActivity(),
                journeyTemplateId,
                referenceNo,
                locale,
                journeyCallback,
                stepCallback
        );
    }

    @ReactMethod
    public void startStep(String stepId) {
        IDWise.INSTANCE.startStep(getCurrentActivity(), stepId);
    }

    @ReactMethod
    public void unloadSDK() {
        UiThreadUtil.runOnUiThread(IDWise.INSTANCE::unloadSDK);
    }


    @ReactMethod
    public void addListener(String eventName) {

    }

    @ReactMethod
    public void removeListeners(Integer count) {

    }

    private void setJourneyCallback() {
        journeyCallback = new IDWiseSDKCallback() {
            @Override
            public void onJourneyStarted(@NonNull JourneyInfo journeyInfo) {
                WritableMap params = Arguments.createMap();
                params.putString("journeyId", journeyInfo.getJourneyId());
                sendEvent("journeyStarted", params);
            }

            @Override
            public void onJourneyResumed(@NonNull JourneyInfo journeyInfo) {
                WritableMap params = Arguments.createMap();
                params.putString("journeyId", journeyInfo.getJourneyId());
                sendEvent("journeyResumed", params);
            }

            @Override
            public void onJourneyCompleted(@NonNull JourneyInfo journeyInfo, boolean isCompleted) {
                WritableMap params = Arguments.createMap();
                params.putString("journeyId", journeyInfo.getJourneyId());
                sendEvent("journeyCompleted", params);
            }

            @Override
            public void onJourneyCancelled(@Nullable JourneyInfo journeyInfo) {
                WritableMap params = Arguments.createMap();
                params.putString("journeyId", journeyInfo == null ? null : journeyInfo.getJourneyId());
                sendEvent("journeyCancelled", params);
            }

            @Override
            public void onError(@NonNull IDWiseSDKError idWiseSDKError) {

                WritableMap params = Arguments.createMap();
                params.putInt("errorCode", idWiseSDKError.getErrorCode());
                params.putString("errorMessage", idWiseSDKError.getMessage());
                sendEvent("onError", params);

            }
        };
    }

    private void setStepCallback() {
        stepCallback = new IDWiseSDKStepCallback() {
            @Override
            public void onStepCaptured(@NonNull String s, @Nullable Bitmap bitmap, @Nullable Bitmap croppedBitmap) {
                WritableMap params = Arguments.createMap();
                params.putString("stepId", s);

                if (croppedBitmap != null) {
                    ByteArrayOutputStream stream = new ByteArrayOutputStream();
                    croppedBitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);

//                    params.putString("bitmapBase64", Base64.encodeToString(stream.toByteArray(), Base64.DEFAULT));
                    WritableArray array = new WritableNativeArray();
                    byte[] bytes = stream.toByteArray();
                    for (byte b : bytes) {
                        array.pushInt(b);
                    }
                    params.putArray("bitmapBase64Bytes", array);
                }
                sendEvent("stepCaptured", params);
            }

            @Override
            public void onStepResult(@NonNull String s, @Nullable StepResult stepResult) {
                WritableMap params = Arguments.createMap();
                params.putString("stepId", s);
                params.putString("stepResult", new Gson().toJson(stepResult));
                sendEvent("stepResult", params);
            }

            @Override
            public void onStepConfirmed(@NonNull String s) {
                /**
                 * No need to implement this as for latest version it's not being required.
                 */
            }
        };
    }
}

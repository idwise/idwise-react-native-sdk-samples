package com.idwisereactnativesample;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;
import com.idwise.sdk.IDWise;
import com.idwise.sdk.IDWiseSDKCallback;
import com.idwise.sdk.IDWiseSDKStepCallback;
import com.idwise.sdk.data.models.IDWiseSDKError;
import com.idwise.sdk.data.models.IDWiseSDKTheme;
import com.idwise.sdk.data.models.JourneyInfo;
import com.idwise.sdk.data.models.JourneySummary;
import com.idwise.sdk.data.models.StepResult;

import kotlin.Unit;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.functions.Function2;

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
    public void startStepFromFileUpload(String stepId, byte[] data) {
        IDWise.INSTANCE.startStepFromFileUpload(getCurrentActivity(), stepId, data);
    }

    @ReactMethod
    public void getJourneySummary(String journeyId) {
        Function2<? super JourneySummary, ? super IDWiseSDKError, Unit> summaryCallback = (Function2<JourneySummary, IDWiseSDKError, Unit>) (summary, error) -> {

            WritableMap params = Arguments.createMap();

            if (summary != null) {
                Gson gson = new Gson();
                params.putString("journeyId", summary.getJourneyId());
                params.putString("journeyStepSummaries", gson.toJson(summary.getStepSummaries()));
                params.putString("journeyDefinition", gson.toJson(summary.getJourneyDefinition()));
                params.putString("journeyResult", gson.toJson(summary.getJourneyResult()));
                params.putBoolean("journeyIsComplete", summary.isCompleted());
                sendEvent("onJourneySummary", params);
            }

            if (error != null) {
                params.putInt("errorCode", error.getErrorCode());
                params.putString("errorMessage", error.getMessage());
                sendEvent("onError", params);
            }

            return null;
        };

        IDWise.INSTANCE.getJourneySummary(journeyId, summaryCallback);
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
    }

    private void setStepCallback() {
        stepCallback = new IDWiseSDKStepCallback() {
            @SuppressLint("CheckResult")
            @Override
            public void onStepCaptured(@NonNull String s, @Nullable Bitmap bitmap, @Nullable Bitmap croppedBitmap) {
                WritableMap params = Arguments.createMap();
                params.putString("stepId", s);
                sendEvent("onStepCaptured", params);
            }

            @Override
            public void onStepResult(@NonNull String s, @Nullable StepResult stepResult) {
                WritableMap params = Arguments.createMap();
                params.putString("stepId", s);
                params.putString("stepResult", new Gson().toJson(stepResult));
                sendEvent("onStepResult", params);
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

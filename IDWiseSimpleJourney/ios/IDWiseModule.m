//
//  RCTIDWise.m
//  idwiseReactNativeSample
//
//  Created by Hafiz Ahsan on 14/04/2022.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(IDWiseModule,RCTEventEmitter)

RCT_EXTERN_METHOD(initialize:(NSString *)clientKey
                  :(NSString *)theme) 
RCT_EXTERN_METHOD(startJourney:(NSString *)journeyDefinitionID
                  :(NSString *)referenceNo
                  :(NSString *)locale)
RCT_EXTERN_METHOD(supportedEvents)
@end

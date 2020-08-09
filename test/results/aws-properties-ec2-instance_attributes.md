# AWS::EC2::Instance

### Ref

When you pass the logical ID of this resource to the intrinsic `Ref` function, `Ref` returns the instance ID\. For example: `i-1234567890abcdef0`\.


### Fn::GetAtt

The `Fn::GetAtt` intrinsic function returns a value for a specified attribute of this type\. The following are the available attributes and sample return values\.


#### 

`AvailabilityZone`  
The Availability Zone where the specified instance is launched\. For example: `us-east-1b`\.  
You can retrieve a list of all Availability Zones for a Region by using the [Fn::GetAZs](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getavailabilityzones.html) intrinsic function\.

`PrivateDnsName`  
The private DNS name of the specified instance\. For example: `ip-10-24-34-0.ec2.internal`\.

`PrivateIp`  
The private IP address of the specified instance\. For example: `10.24.34.0`\.

`PublicDnsName`  
The public DNS name of the specified instance\. For example: `ec2-107-20-50-45.compute-1.amazonaws.com`\.

`PublicIp`  
The public IP address of the specified instance\. For example: `192.0.2.0`\.


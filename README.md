#### Droplet Provisioning
1. Set your token

```
# Mac/Linux
export DO_TOKEN="xxx"
# Windows
setx DO_TOKEN xxx
```

2. Run the node program
`node index.js`

3. ssh into the new droplet
`ssh root@IPAddress`

IPAddress can be obtained from step 2.

#### AWS EC2 Provisioning
1. Set your token and keys
* Go to IAM from the AWS console. Create a user with the appropriate permissions.
* Select the user and go to the **Security Credentials** tab. 
* Under the **Access Key** section create your key by selecting the **Create Access Key** option and save the file.
* Under the **SSH keys for AWS CodeCommit** section select the **Upload SSH public Key** option and import your local public key (generated using `ssh-keygen`).

```
# Mac/Linux
export AWS_ID="xxx"
export AWS_TOKEN="yyy"
# Windows
setx AWS_ID xxx
setx AWS_TOKEN yyy
```
The values for the ID and Token can be obtained in the file from subsection 3 above.

2. Run the node program
`node aws.js`

3. SSH into the new VM instance
`ssh -i id_rsa.pem centos@IPAddress`

IPAddress can be obtained from step 2.


##### Video Link:
* https://youtu.be/bSe7yWaRjbY


##### NOTE:
Don't forget to comment sections of the code that create the instances once the instances have been created to avoid creating multiple instances










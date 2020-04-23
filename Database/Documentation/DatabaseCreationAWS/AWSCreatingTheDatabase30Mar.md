#How to setup a Relational MySQL Database with Amazon RDS
Create and Connect to a MySQL Database with Amazon RDS

In this tutorial, you will learn how to create an environment to run your MySQL database (we call this environment an instance), connect to the database, and delete the DB instance.  We will do this using Amazon Relational Database Service (Amazon RDS) and everything done in this tutorial is free-tier eligible.

When you click here, the AWS management console will open in a new browser window, so you can keep this step-by-step guide open. When this screen loads, find RDS under Database and click to open the Amazon RDS Console.
AWS Console Image
(click to zoom)
![test image](/Database/Documentation/DocumentationImages/AWS%20Console%20Image.png)
Step 1: Create a MySQL DB Instance
In this step, we will use Amazon RDS to create a MySQL DB Instance with db.t2.micro DB instance class, 20 GB of storage, and automated backups enabled with a retention period of one day. As a reminder, all of this is free tier eligible.

a. In the top right corner of the Amazon RDS console, select the Region in which you want to create the DB instance.

Note: AWS Cloud resources are housed in highly available data center facilities in different areas of the world. Each Region contains multiple distinct locations called Availability Zones. You have the ability to choose which Region to host your Amazon RDS activity in. 

rds-2-location
(click to zoom)
![image](/Database/Documentation/DocumentationImages/rds-2-location.png)
b.   In the Create database section, choose Create database.

 

 

rds-3-instances
(click to zoom)
![image](/Database/Documentation/DocumentationImages/rds-3-instanes.png)
c.  You now have options to select your engine.  For this tutorial, click the MySQL icon, choose Only enable options eligible for RDS Free Usage Tier, and then click Next.

 

rds-5-selectMySQL
(click to zoom)
![image](/Database/Documentation/DocumentationImages/rds-5-selectMySQL.png)
d. You will now configure your DB instance. The list below shows the example settings you can use for this tutorial:

Instance specifications:

License model: Select the default general-public-license to use the general license agreement for MySQL. MySQL has only one license model.
DB engine version: Select the default version of MySQL. Note that Amazon RDS supports multiple versions of MySQL in some Regions.
DB instance class: Select db.t2.micro --- 1vCPU, 1 GIB RAM.  This equates to 1 GB memory and 1 vCPU. To see a list of supported instance classes, see Amazon RDS Product Details.
Multi-AZ deployment: Note that you will have to pay for Multi-AZ deployment. Using a Multi-AZ deployment will automatically provision and maintain a synchronous standby replica in a different Availability Zone.  For more information, see High Availability Deployment.
Storage type: Select General Purpose (SSD). For more information about storage, see Storage for Amazon RDS.
Allocated storage: Select the default of 20 to allocate 20 GB of storage for your database.  You can scale up to a maximum of 16 TB with Amazon RDS for MySQL.
Enable storage autoscaling: If your workload is cyclical or unpredictable, you would enable storage autoscaling to enable RDS to automatically scale up your storage when needed. This option does not apply to this tutorial.
Settings:

DB instance identifier: Type a name for the DB instance that is unique for your account in the Region that you selected. For this tutorial, we will name it rds-mysql-10minTutorial.
Master username: Type a username that you will use to log in to your DB instance. We will use masterUsername in this example.
Master password: Type a password that contains from 8 to 41 printable ASCII characters (excluding /,", and @) for your master user password.
Confirm password: Retype your password
Allocated Storage: Type 5 to allocate 5 GB of storage for your database. For more information about storage allocation, see Amazon Relational Database Service Features. (switch ordering, its after storage type)
Click Next.

 

rds-6-devtest
(click to zoom)
![image](/Database/Documentation/DocumentationImages/rds-6-devtest.png)
e. You are now on the Configure advanced settings page where you can provide additional information that RDS needs to launch your MySQL DB instance. The list below shows settings for our example DB instance.
Network & Security
Virtual Private Cloud (VPC): Select Default VPC. For more information about VPC, see Amazon RDS and Amazon Virtual Private Cloud (VPC).
Subnet group: Choose the default subnet group. For more information about subnet groups, see Working with DB Subnet Groups.
Public accessibliity: Choose Yes. This will allocate an IP address for your database instance so that you can directly connect to the database from your own device.
Availability zone: Choose No preference. See Regions and Availability Zones for more details.
VPC security groups: Select Create new VPC security group. This will create a security group that will allow connection from the IP address of the device that you are currently using to the database created.
Database options

Database name: Type a database name that is 1 to 64 alpha-numeric characters. If you do not provide a name, Amazon RDS will not automatically create a database on the DB instance you are creating.
Port: Leave the default value of 3306.
DB parameter group: Leave the default value of default.mysql5.6. For more information, see Working with DB Parameter Groups.
Option group: Select the default value of default:mysql5.7. Amazon RDS uses option groups to enable and configure additional features.  For more information, see Working with Option Groups.
IAM DB authentication: Select Disable. This option allows you to manage your database credentials using AWS IAM users and groups.
Encryption

This option is not available in the free tier. For more information, see Encrypting Amazon RDS Resources.

Backup

Backup retention period: You can choose the number of days to retain the backup you take. For this tutorial, set this value to 1 day.
Backup window: Use the default of No preference.
Monitoring

Enhanced Monitoring: Select Disable enhanced monitoring to stay within the free tier. Enabling enhanced monitoring will give you metrics in real time for the operating system (OS) that your DB instance runs on. For more information, see Viewing DB Instance Metrics.
Performance Insights

Select Disable Performance Insights for this tutorial.

Maintenance

Auto minor version upgrade: Select Enable auto minor version upgrade to receive automatic updates when they become available.
Maintenance Window: Select No preference.
Deletion protection

Clear Enable deletion protection for this tutorial. When this option is enabled, you can't delete the database.
 

Click Create database.

rds-9-form
![image](/Database/Documentation/DocumentationImages/rds-9-form.png)
f. Your DB Instance is now being created.  Click View Your DB Instances.

Note: Depending on the DB instance class and storage allocated, it could take several minutes for the new DB instance to become available.

The new DB instance appears in the list of DB instances on the RDS console. The DB instance will have a status of creating until the DB instance is created and ready for use.  When the state changes to available, you can connect to a database on the DB instance. 

Feel free to move on to the next step as you wait for the DB instance to become available.

rds-11-dbcreated
(click to zoom)
![image](/Database/Documentation/DocumentationImages/rds-11-dbcreated.png)
Step 2: Download a SQL Client
Once the database instance creation is complete and the status changes to available, you can connect to a database on the DB instance using any standard SQL client. In this step, we will download MySQL Workbench, which is a popular SQL client.

a. Go to the Download MySQL Workbench page to download and install MySQL Workbench. For more information on using MySQL, see the MySQL Documentation.

Note:  Remember to run MySQL Workbench from the same device from which you created the DB Instance. The security group your database is placed in is configured to allow connection only from the device from which you created the DB instance.

rds-21-downloadMySQL
(click to zoom)
![image](/Database/Documentation/DocumentationImages/rds-21-downloadMySQL.png)

b. You will be prompted to login, sign up, or begin your download.  You can click No thanks, just start my download for a quick download.

rds-22-mysql
(click to zoom)
![image](/Database/Documentation/DocumentationImages/rds-22-mysql.png)

Step 3: Connect to the MySQL Database
In this step, we will connect to the database you created using MySQL Workbench.

a. Launch the MySQL Workbench application and go to Database > Connect to Database (Ctrl+U) from the menu bar.

rds-13-mySQLworkbench
(click to zoom)
![image](/Database/Documentation/DocumentationImages/rds-13-mySQLworkbench.png)
b. A dialog box appears.  Enter the following:

Hostname: You can find your hostname on the Amazon RDS console as shown in the screenshot to the right.  
Port: The default value should be 3306.
Username: Type in the username you created for the Amazon RDS database.  In this tutorial, it is 'masterUsername.'
Password: Click Store in Vault (or Store in Keychain on macOS) and enter the password that you used when creating the Amazon RDS database.
Click OK

 

Untitled-2
(click to zoom)
![image](/Database/Documentation/DocumentationImages/newname.png)
c. You are now connected to the database! On the MySQL Workbench, you will see various schema objects available in the database. Now you can start creating tables, insert data, and run queries.

rds-18-mysqlInterface
(click to zoom)
![image](/Database/Documentation/DocumentationImages/rds-18-mysqlInterface.png)
Step 4: Delete the DB Instance
You can easily delete the MySQL DB Instance from the Amazon RDS console. It is a best practice to delete instances that you are no longer using so that you don’t keep getting charged for them.
a. Go back to your Amazon RDS Console. Select Databases, choose the instance that you want to delete, and then select Delete from the Actions dropdown menu.

rds-20-instanceActions
(click to zoom)
![image](/Database/Documentation/DocumentationImages/rds-20-instanceActions.png)

b. You are asked to create a final snapshot and to confirm the deletion. For our example, do not create a final snapshot, acknowledge that you want to delete the instance, and then click Delete. 

    Note: Deleting your DB Instance may take a few minutes

rds-21-deleteInstance
(click to zoom)
![image](/Database/Documentation/DocumentationImages/rds-21-deleteInstance.png)

Congratulations!
You have created, connected to, and deleted a MySQL Database Instance with Amazon RDS.  Amazon RDS makes it easy to set up, operate, and scale a relational database in the cloud. It provides cost-efficient and resizable capacity while managing time-consuming database administration tasks, freeing you up to focus on your applications and business.

Next Steps
Now that you have learned to create and connect to a MySQL Database through Amazon RDS, you can progress to the next tutorial where you will learn how to use a MySQL database with a PHP application running on a web server.
Create a Web Server and an Amazon RDS Database »

Link to tutorial: https://aws.amazon.com/getting-started/tutorials/create-mysql-db/

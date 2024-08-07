CREATE TABLE `city` (
  `_id` int(11) PRIMARY KEY NOT NULL,
  `CreateddAt` datetime(6) NOT NULL,
  `IdDelete` bit(1),
  `Code` varchar(255) NOT NULL,
  `Name` varchar(255) DEFAULT null,
  `Note` varchar(255) NOT NULL
);

CREATE TABLE `district` (
  `_id` int(11) PRIMARY KEY NOT NULL,
  `City_id` int(11) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `IdDelete` bit(1),
  `Code` varchar(255) NOT NULL,
  `Name` varchar(255) DEFAULT null,
  `Note` varchar(255) NOT NULL
);

CREATE TABLE `ward` (
  `_id` int(11) PRIMARY KEY NOT NULL,
  `District_id` int(11) DEFAULT null,
  `CreatedAt` datetime(6) NOT NULL,
  `IdDelete` bit(1),
  `Code` varchar(255) NOT NULL,
  `Name` varchar(255) DEFAULT null,
  `Note` varchar(255) NOT NULL
);

CREATE TABLE `Employee` (
  `_id` int(11) PRIMARY KEY NOT NULL,
  `ObjectId` int(11),
  `Code` varchar(255) NOT NULL,
  `RoleId` int(11) NOT NULL,
  `City_id` int(11) NOT NULL,
  `District_id` int(11) DEFAULT null,
  `Ward_id` int(11) DEFAULT null,
  `Address` varchar(255) NOT NULL,
  `Avatar` longtext NOT NULL,
  `FullName` varchar(255) NOT NULL,
  `DoB` datetime(6) NOT NULL,
  `Gender` int(11) NOT NULL,
  `Email` longtext NOT NULL,
  `Phone` varchar(45) NOT NULL,
  `CreatedAt` datetime,
  `CreatorUser_id` int(11) NOT NULL,
  `IsDeleted` int(11),
  `DeleterUser_id` int(11) DEFAULT null,
  `DeletionTime` datetime(6) DEFAULT null
);

CREATE TABLE `Role` (
  `_id` int(11) PRIMARY KEY NOT NULL,
  `NameRole` nvarchar(255),
  `Note` nvarchar(11),
  `CreatedAt` datetime,
  `IsDeleted` int(11)
);

CREATE TABLE `RolePermission` (
  `_id` int(11) PRIMARY KEY NOT NULL,
  `RoleId` int(11),
  `NameRolePermission` nvarchar(255),
  `CreatedAt` datetime,
  `IsDeleted` int(11)
);

CREATE TABLE `TemplateScore` (
  `_id` int(11) PRIMARY KEY NOT NULL,
  `Code` varchar(10),
  `EmployeeId` int(11),
  `NameTemplateScore` varchar(255),
  `Note` varchar(255),
  `CreatedAt` datetime,
  `IsDeleted` int(11)
);

CREATE TABLE `Criteria` (
  `_id` int(11) PRIMARY KEY NOT NULL,
  `EmployeeId` int(11),
  `TemplateScoreId` int(11),
  `NameCriteria` nvarchar(255) NOT NULL,
  `CreatedAt` datetime,
  `IsDeleted` int(11)
);

CREATE TABLE `CriteriaDetail` (
  `_id` int(11) PRIMARY KEY NOT NULL,
  `NameCriteriaDetail` nvarchar(255) NOT NULL,
  `EmployeeId` int(11),
  `CriteriaId` int(11),
  `IsScore` int(11),
  `Score` int(11),
  `CreatedAt` datetime,
  `IsDeleted` int(11)
);

CREATE TABLE `ScoreFile` (
  `_id` int(11) PRIMARY KEY NOT NULL,
  `EmployeeId` int(11),
  `TemplateScoreId` int(11),
  `Code` varchar(11),
  `Score` int(11),
  `Status` int(11),
  `IsDefault` int(11),
  `CreatedAt` datetime,
  `IsDeleted` int(11)
);

CREATE TABLE `Object` (
  `_id` int(11) PRIMARY KEY NOT NULL,
  `EmployeeId` int(11),
  `NameObject` nvarchar(255),
  `CreatedAt` datetime,
  `IsDeleted` int(11)
);

ALTER TABLE `CriteriaDetail` ADD FOREIGN KEY (`CriteriaId`) REFERENCES `Criteria` (`_id`);

ALTER TABLE `Criteria` ADD FOREIGN KEY (`TemplateScoreId`) REFERENCES `TemplateScore` (`_id`);

ALTER TABLE `Employee` ADD FOREIGN KEY (`ObjectId`) REFERENCES `Object` (`_id`);

ALTER TABLE `ScoreFile` ADD FOREIGN KEY (`EmployeeId`) REFERENCES `Employee` (`_id`);

ALTER TABLE `ScoreFile` ADD FOREIGN KEY (`TemplateScoreId`) REFERENCES `TemplateScore` (`_id`);

ALTER TABLE `district` ADD FOREIGN KEY (`City_id`) REFERENCES `city` (`_id`);

ALTER TABLE `ward` ADD FOREIGN KEY (`District_id`) REFERENCES `district` (`_id`);

ALTER TABLE `Employee` ADD FOREIGN KEY (`City_id`) REFERENCES `city` (`_id`);

ALTER TABLE `Employee` ADD FOREIGN KEY (`District_id`) REFERENCES `district` (`_id`);

ALTER TABLE `Employee` ADD FOREIGN KEY (`Ward_id`) REFERENCES `ward` (`_id`);

ALTER TABLE `RolePermission` ADD FOREIGN KEY (`RoleId`) REFERENCES `Role` (`_id`);

ALTER TABLE `Employee` ADD FOREIGN KEY (`RoleId`) REFERENCES `Role` (`_id`);

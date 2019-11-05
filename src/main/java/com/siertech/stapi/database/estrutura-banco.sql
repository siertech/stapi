-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: localhost    Database: db_31993901343
-- ------------------------------------------------------
-- Server version	5.5.51-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `config`
--

DROP TABLE IF EXISTS `config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `config` (
  `id` bigint(20) NOT NULL,
  `formaPagamentoPadrao` varchar(255) DEFAULT NULL,
  `modoOperacao` int(11) NOT NULL,
  `nomeEmpresa` varchar(255) DEFAULT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `config`
--

LOCK TABLES `config` WRITE;
/*!40000 ALTER TABLE `config` DISABLE KEYS */;
INSERT INTO `config` VALUES (1,NULL,0,'Philipe (Usuário 223)',NULL);
/*!40000 ALTER TABLE `config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `config_confs`
--

DROP TABLE IF EXISTS `config_confs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `config_confs` (
  `Config_id` bigint(20) NOT NULL,
  `confs` varchar(255) DEFAULT NULL,
  `confs_KEY` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`Config_id`,`confs_KEY`),
  KEY `FK293B76B247F4D2C6` (`Config_id`),
  CONSTRAINT `FK293B76B247F4D2C6` FOREIGN KEY (`Config_id`) REFERENCES `config` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `config_confs`
--

LOCK TABLES `config_confs` WRITE;
/*!40000 ALTER TABLE `config_confs` DISABLE KEYS */;
INSERT INTO `config_confs` VALUES (1,'backEndVersion','3.0');
/*!40000 ALTER TABLE `config_confs` ENABLE KEYS */;
UNLOCK TABLES;


CREATE TABLE `pessoa` (
  `tipo_pessoa` varchar(31) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `allFilials` int(11) DEFAULT '0',
  `dataCadastro` date DEFAULT NULL,
  `disable` int(11) NOT NULL,
  `historicoObjeto` longtext,
  `idFilial` bigint(20) NOT NULL DEFAULT '1',
  `idOperador` bigint(20) NOT NULL DEFAULT '1',
  `nome` varchar(255) DEFAULT NULL,
  `filiaisPermitidas` varchar(255) DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `permissoes` varchar(255) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pessoa`
--

LOCK TABLES `pessoa` WRITE;
/*!40000 ALTER TABLE `pessoa` DISABLE KEYS */;
INSERT INTO `pessoa` VALUES ('operador_sistema',1,1,NULL,0,NULL,1,1,'Admin',NULL,'admin',NULL,'123');
/*!40000 ALTER TABLE `pessoa` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

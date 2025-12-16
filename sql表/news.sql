/*
 Navicat Premium Data Transfer

 Source Server         : web
 Source Server Type    : MySQL
 Source Server Version : 50724
 Source Host           : localhost:3306
 Source Schema         : web

 Target Server Type    : MySQL
 Target Server Version : 50724
 File Encoding         : 65001

 Date: 22/04/2025 14:42:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `date` date NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 521 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of news
-- ----------------------------
INSERT INTO `news` VALUES (501, '保定学院2025年高层次人才选聘公告', 'https://www.bdu.edu.cn/info/1017/7028.htm', '2025-04-16', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (502, '保定学院第十七届运动会火炬传递启动仪式举行', 'https://www.bdu.edu.cn/info/1015/7030.htm', '2025-04-16', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (503, '我校召开2025年全面从严治党工作会议', 'https://www.bdu.edu.cn/info/1015/7029.htm', '2025-04-16', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (504, '2025年保定学院保安服务外包（夜班）竞争性磋商公告', 'https://www.bdu.edu.cn/info/1017/7026.htm', '2025-04-15', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (505, '周林伟带队赴中国信息通信研究院泰尔系统实验室调研交流', 'https://www.bdu.edu.cn/info/1015/7024.htm', '2025-04-10', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (506, '“国培计划（2024）”河北省县级骨干教师能力提升培训初中道德与法治学科培训班在我校开班', 'https://www.bdu.edu.cn/info/1015/7022.htm', '2025-04-07', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (507, '精诚工科汽车系统有限公司保定分公司来我校调研交流', 'https://www.bdu.edu.cn/info/1015/7023.htm', '2025-04-06', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (508, '筑梦乡村 书送未来：图书馆党支部主题党日活动温暖开展', 'https://www.bdu.edu.cn/info/1016/7020.htm', '2025-04-03', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (509, '团委举办清明祭扫主题团日活动', 'https://www.bdu.edu.cn/info/1016/7018.htm', '2025-04-03', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (510, '保定学院2025年公开选聘教师进入体检环节人员名单公布', 'https://www.bdu.edu.cn/info/1017/7012.htm', '2025-04-01', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (511, '保定学院第二学生食堂委托经营服务项目招标公告', 'https://www.bdu.edu.cn/info/1017/7011.htm', '2025-03-27', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (512, '我校组织开展学雷锋志愿服务集中行动', 'https://www.bdu.edu.cn/info/1016/6974.htm', '2025-03-07', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (513, '保定学院科协获评保定市先进高校科协', 'https://www.bdu.edu.cn/info/1101/6967.htm', '2025-03-03', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (514, '保定学院2025年度教育网宽带接入项目单一来源采购公告', 'https://www.bdu.edu.cn/info/1017/6937.htm', '2025-01-08', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (515, '“保定文化系列十讲”活动圆满落幕', 'https://www.bdu.edu.cn/info/1101/6894.htm', '2024-12-06', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (516, '保定学院办学120周年优秀校友系列讲座第十三讲举行 校友梁美富聚焦现代体育训练的革新提升', 'https://www.bdu.edu.cn/info/1101/6886.htm', '2024-12-05', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (517, '清华大学美术学院教授李睦来校作学术讲座', 'https://www.bdu.edu.cn/info/1101/6895.htm', '2024-12-05', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (518, '保定学院办学120周年优秀校友系列讲座第十二讲举行 校友刘轩以学术研究启迪历史思维', 'https://www.bdu.edu.cn/info/1101/6885.htm', '2024-12-05', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (519, '第二届大学生职业生涯规划大赛圆满落幕', 'https://www.bdu.edu.cn/info/1016/6870.htm', '2024-11-29', '2025-04-18 20:22:50');
INSERT INTO `news` VALUES (520, '我校受邀参加保定市2024年“世界标准日”主题活动', 'https://www.bdu.edu.cn/info/1016/6802.htm', '2024-10-18', '2025-04-18 20:22:50');

SET FOREIGN_KEY_CHECKS = 1;

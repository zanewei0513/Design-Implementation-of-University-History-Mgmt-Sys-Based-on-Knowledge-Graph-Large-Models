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

 Date: 22/04/2025 14:48:36
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for history_events
-- ----------------------------
DROP TABLE IF EXISTS `history_events`;
CREATE TABLE `history_events`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` int(11) NOT NULL,
  `event` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of history_events
-- ----------------------------
INSERT INTO `history_events` VALUES (1, 1904, '学校前身\"保定初级师范学堂\"始建。', '2025-03-28 09:38:18');
INSERT INTO `history_events` VALUES (2, 1910, '学堂改称\"直隶第二初级师范学堂\"，在当地教育领域崭露头角，为培养师范人才奠定坚实基础。', '2025-03-28 09:38:18');
INSERT INTO `history_events` VALUES (3, 1928, '随省份名称变更，学堂易名为\"河北省立第二师范学校\"，学校不断发展壮大，在师资力量、教学规模等方面显著提升，成为河北省师范教育的重要基地之一。', '2025-03-28 09:38:18');
INSERT INTO `history_events` VALUES (4, 1934, '学校再次更名为\"河北省立保定师范学校\"，进一步明确了其在保定地区教育事业中的核心地位，此后始终坚持师范教育办学方向，为社会培养大批优秀教育人才。', '2025-03-28 09:38:18');
INSERT INTO `history_events` VALUES (5, 1949, '学校正式更名为 \"冀中区保定师范学校\"，积极响应国家教育发展号召，全面加强教学管理、优化教学方法，大力提升教学质量与办学水平，为区域教育事业注入新的活力', '2025-03-28 09:38:18');
INSERT INTO `history_events` VALUES (6, 1950, '学校更名为\"河北省立保定师范学校\"，在教育的沃野上精耕细作，用心提升教学的品质与办学的格调，以蓬勃之姿书写着育人的新篇章。', '2025-03-28 09:38:18');
INSERT INTO `history_events` VALUES (7, 1978, '学校顺应时代发展需求改建为\"保定师范专科学校\"，开始向专科层次的高等教育迈进，拓展学科专业领域，为地方经济社会发展培养更多类型专业人才。', '2025-03-28 09:38:18');
INSERT INTO `history_events` VALUES (8, 2007, '学校升格为本科层次的普通高校，并正式更名为\"保定学院\"，踏上新的发展征程，在学科建设、师资队伍、科研水平等方面取得长足进步，逐步成为具有一定影响力的综合性本科院校。', '2025-03-28 09:38:18');

SET FOREIGN_KEY_CHECKS = 1;

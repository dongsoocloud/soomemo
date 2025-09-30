const express = require('express');
const { Op } = require('sequelize');
const { Category, Memo } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 카테고리 목록 조회
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'ASC']]
    });
    
    res.json(categories);
  } catch (error) {
    console.error('카테고리 목록 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 카테고리 생성
router.post('/', async (req, res) => {
  try {
    const { name, color } = req.body;
    
    // 입력 검증
    if (!name) {
      return res.status(400).json({ message: '카테고리 이름을 입력해주세요.' });
    }
    
    // 중복 이름 검사
    const existingCategory = await Category.findOne({
      where: { name, userId: req.user.id }
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: '이미 존재하는 카테고리 이름입니다.' });
    }
    
    const category = await Category.create({
      name,
      color: color || '#6c757d',
      userId: req.user.id
    });
    
    res.status(201).json(category);
  } catch (error) {
    console.error('카테고리 생성 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 카테고리 수정
router.put('/:id', async (req, res) => {
  try {
    const { name, color } = req.body;
    
    // 입력 검증
    if (!name) {
      return res.status(400).json({ message: '카테고리 이름을 입력해주세요.' });
    }
    
    // 카테고리 존재 확인 및 소유권 검증
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!category) {
      return res.status(404).json({ message: '카테고리를 찾을 수 없습니다.' });
    }
    
    // 중복 이름 검사 (자기 자신 제외)
    const existingCategory = await Category.findOne({
      where: { 
        name, 
        userId: req.user.id,
        id: { [Op.ne]: req.params.id }
      }
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: '이미 존재하는 카테고리 이름입니다.' });
    }
    
    // 카테고리 업데이트
    await category.update({
      name,
      color: color || category.color
    });
    
    res.json(category);
  } catch (error) {
    console.error('카테고리 수정 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 카테고리 삭제
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!category) {
      return res.status(404).json({ message: '카테고리를 찾을 수 없습니다.' });
    }
    
    // 기본 카테고리는 삭제할 수 없음
    if (category.name === '기본') {
      return res.status(400).json({ message: '기본 카테고리는 삭제할 수 없습니다.' });
    }
    
    // 기본 카테고리 찾기 (삭제된 카테고리의 메모들을 이동시킬 카테고리)
    const defaultCategory = await Category.findOne({
      where: { 
        name: '기본',
        userId: req.user.id 
      }
    });
    
    if (defaultCategory) {
      // 해당 카테고리의 메모들을 기본 카테고리로 이동
      await Memo.update(
        { categoryId: defaultCategory.id },
        { where: { categoryId: category.id, userId: req.user.id } }
      );
    }
    
    await category.destroy();
    res.json({ message: '카테고리가 삭제되었습니다.' });
  } catch (error) {
    console.error('카테고리 삭제 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;

const express = require('express');
const { Memo, Category } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 메모 목록 조회
router.get('/', async (req, res) => {
  try {
    const { categoryId, search } = req.query;
    
    let whereClause = { userId: req.user.id };
    
    // 카테고리 필터링
    if (categoryId && categoryId !== 'all') {
      whereClause.categoryId = categoryId;
    }
    
    const memos = await Memo.findAll({
      where: whereClause,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'color']
      }],
      order: [['order', 'ASC'], ['updatedAt', 'DESC']]
    });
    
    // 검색 필터링 (서버 사이드)
    let filteredMemos = memos;
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase();
      filteredMemos = memos.filter(memo => 
        memo.title.toLowerCase().includes(searchTerm) ||
        memo.content.toLowerCase().includes(searchTerm)
      );
    }
    
    res.json(filteredMemos);
  } catch (error) {
    console.error('메모 목록 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 특정 메모 조회
router.get('/:id', async (req, res) => {
  try {
    const memo = await Memo.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'color']
      }]
    });
    
    if (!memo) {
      return res.status(404).json({ message: '메모를 찾을 수 없습니다.' });
    }
    
    res.json(memo);
  } catch (error) {
    console.error('메모 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 메모 생성
router.post('/', async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;
    
    // 입력 검증
    if (!title || !content) {
      return res.status(400).json({ message: '제목과 내용을 입력해주세요.' });
    }
    
    // 카테고리 존재 확인
    const category = await Category.findOne({
      where: { id: categoryId, userId: req.user.id }
    });
    
    if (!category) {
      return res.status(400).json({ message: '유효하지 않은 카테고리입니다.' });
    }
    
    const memo = await Memo.create({
      title,
      content,
      categoryId,
      userId: req.user.id
    });
    
    // 생성된 메모를 카테고리 정보와 함께 반환
    const createdMemo = await Memo.findByPk(memo.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'color']
      }]
    });
    
    res.status(201).json(createdMemo);
  } catch (error) {
    console.error('메모 생성 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 메모 수정
router.put('/:id', async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;
    
    // 입력 검증
    if (!title || !content) {
      return res.status(400).json({ message: '제목과 내용을 입력해주세요.' });
    }
    
    // 메모 존재 확인 및 소유권 검증
    const memo = await Memo.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!memo) {
      return res.status(404).json({ message: '메모를 찾을 수 없습니다.' });
    }
    
    // 카테고리 존재 확인
    const category = await Category.findOne({
      where: { id: categoryId, userId: req.user.id }
    });
    
    if (!category) {
      return res.status(400).json({ message: '유효하지 않은 카테고리입니다.' });
    }
    
    // 메모 업데이트
    await memo.update({
      title,
      content,
      categoryId
    });
    
    // 업데이트된 메모를 카테고리 정보와 함께 반환
    const updatedMemo = await Memo.findByPk(memo.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'color']
      }]
    });
    
    res.json(updatedMemo);
  } catch (error) {
    console.error('메모 수정 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 메모 삭제
router.delete('/:id', async (req, res) => {
  try {
    const memo = await Memo.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!memo) {
      return res.status(404).json({ message: '메모를 찾을 수 없습니다.' });
    }
    
    await memo.destroy();
    res.json({ message: '메모가 삭제되었습니다.' });
  } catch (error) {
    console.error('메모 삭제 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 메모 순서 변경
router.put('/reorder', async (req, res) => {
  try {
    const { memoIds } = req.body;
    
    if (!Array.isArray(memoIds)) {
      return res.status(400).json({ message: '메모 ID 배열이 필요합니다.' });
    }
    
    // 모든 메모가 해당 사용자의 것인지 확인
    const memos = await Memo.findAll({
      where: {
        id: memoIds,
        userId: req.user.id
      }
    });
    
    if (memos.length !== memoIds.length) {
      return res.status(400).json({ message: '유효하지 않은 메모가 포함되어 있습니다.' });
    }
    
    // 순서 업데이트
    for (let i = 0; i < memoIds.length; i++) {
      await Memo.update(
        { order: i },
        { where: { id: memoIds[i], userId: req.user.id } }
      );
    }
    
    res.json({ message: '메모 순서가 변경되었습니다.' });
  } catch (error) {
    console.error('메모 순서 변경 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;

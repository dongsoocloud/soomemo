const express = require('express');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log('📝 회원가입 요청:', { username, email, passwordLength: password?.length });

    // 입력 검증
    if (!username || !email || !password) {
      console.log('❌ 입력 검증 실패:', { username: !!username, email: !!email, password: !!password });
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    // 중복 검사
    console.log('🔍 중복 검사 시작');
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });
    console.log('👤 중복 검사 결과:', { found: !!existingUser });

    if (existingUser) {
      console.log('❌ 중복 사용자 발견:', { email, username });
      return res.status(400).json({ message: '이미 존재하는 이메일 또는 사용자명입니다.' });
    }

    // 사용자 생성
    console.log('👤 사용자 생성 시작');
    const user = await User.create({
      username,
      email,
      password
    });
    console.log('✅ 사용자 생성 완료:', { userId: user.id, username: user.username });

    // 기본 카테고리 생성
    console.log('📁 기본 카테고리 생성 시작');
    const { Category } = require('../models');
    await Category.create({
      name: '기본',
      color: '#6c757d',
      userId: user.id
    });
    console.log('✅ 기본 카테고리 생성 완료');

    // JWT 토큰 생성
    console.log('🔑 JWT 토큰 생성 시작');
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    console.log('✅ JWT 토큰 생성 완료');

    console.log('🎉 회원가입 성공:', { userId: user.id, username: user.username });

    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ 회원가입 오류:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 로그인 요청:', { email, passwordLength: password?.length });

    // 입력 검증
    if (!email || !password) {
      console.log('❌ 입력 검증 실패:', { email: !!email, password: !!password });
      return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
    }

    // 사용자 찾기
    const user = await User.findOne({ where: { email } });
    console.log('👤 사용자 찾기:', { found: !!user, userId: user?.id });
    
    if (!user) {
      console.log('❌ 사용자 없음:', { email });
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 검증
    const isValidPassword = await user.validatePassword(password);
    console.log('🔑 비밀번호 검증:', { isValid: isValidPassword });
    
    if (!isValidPassword) {
      console.log('❌ 비밀번호 불일치:', { email });
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('✅ 로그인 성공:', { userId: user.id, username: user.username });

    res.json({
      message: '로그인이 완료되었습니다.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ 로그인 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 사용자 정보 조회
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email
      }
    });
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;

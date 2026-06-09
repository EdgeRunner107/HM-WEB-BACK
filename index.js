const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 8888;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    realtime: {
      transport: WebSocket,
    },
  }
);

app.get('/', (req, res) => {
  res.send('Node.js + Supabase 서버 실행됨!');
});

async function getTableData(tableName, orderColumn = 'id') {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .order(orderColumn, { ascending: false });

  if (error) throw error;

  return data;
}

app.get('/posts', async (req, res) => {
  try {
    const data = await getTableData('afpost');

    const rows = data.map(item => [
      item.title,
      item.contents,
      item.datetime,
      item.bjname,
      item.url,
    ]);

    res.json(rows);
  } catch (error) {
    console.error('posts 조회 오류:', error.message);
    res.status(500).json({ error: 'Failed to fetch posts from Supabase' });
  }
});

app.get('/afvods', async (req, res) => {
  try {
    const data = await getTableData('afvods');

    const rows = data.map(item => [
      item.title,
      item.url,
    ]);

    res.json(rows);
  } catch (error) {
    console.error('afvods 조회 오류:', error.message);
    res.status(500).json({ error: 'Failed to fetch afvods from Supabase' });
  }
});

app.get('/aflives', async (req, res) => {
  try {
    const data = await getTableData('aflives');

    const rows = data.map(item => [
      item.title,
      item.url,
    ]);

    res.json(rows);
  } catch (error) {
    console.error('aflives 조회 오류:', error.message);
    res.status(500).json({ error: 'Failed to fetch aflives from Supabase' });
  }
});

app.get('/shorts', async (req, res) => {
  try {
    const data = await getTableData('afshorts');

    const rows = data.map(item => [
      item.title,
      item.url,
    ]);

    res.json(rows);
  } catch (error) {
    console.error('shorts 조회 오류:', error.message);
    res.status(500).json({ error: 'Failed to fetch shorts from Supabase' });
  }
});

app.get('/afbjs', async (req, res) => {
  try {
    const data = await getTableData('bjs', 'id');

    const rows = data.map(item => [
      item.id,
      item.bj_name,
      item.profile_image,
      item.url,
    ]);

    res.json(rows);
  } catch (error) {
    console.error('afbjs 조회 오류:', error.message);
    res.status(500).json({ error: 'Failed to fetch afbjs from Supabase' });
  }
});

app.get('/hm-signature', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hm_signature')
      .select('id, image_name, image_path, youtube_url')
      .order('id', { ascending: true });

    if (error) throw error;

    const rows = data.map(item => [
      item.id,
      item.image_name,
      item.image_path,
      item.youtube_url,
    ]);

    res.json(rows);
  } catch (error) {
    console.error('hm_signature 조회 오류:', error.message);
    res.status(500).json({
      error: 'Failed to fetch hm_signature from Supabase',
      message: error.message,
    });
  }
});

app.get('/salary-settings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('salary_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    res.json({
      round_revenues: data.round_revenues || {},
      shares: data.shares || {},
      penalties: data.penalties || {},
      special_contributions: data.special_contributions || {},
      special_round_shares: data.special_round_shares || {},
      job_battle_rate: data.job_battle_rate || '0.55',
      total_contribution_rate: data.total_contribution_rate || '0.7',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'salary settings load failed' });
  }
});

// 급여 설정 저장/수정
app.put('/salary-settings', async (req, res) => {
  try {
    const {
      round_revenues,
      shares,
      penalties,
      special_contributions,
      special_round_shares,
      job_battle_rate,
      total_contribution_rate,
    } = req.body;

    const { data, error } = await supabase
      .from('salary_settings')
      .upsert(
        {
          id: 1,
          round_revenues: round_revenues || {},
          shares: shares || {},
          penalties: penalties || {},
          special_contributions: special_contributions || {},
          special_round_shares: special_round_shares || {},
          job_battle_rate: job_battle_rate || '0.55',
          total_contribution_rate: total_contribution_rate || '0.7',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'salary settings save failed' });
  }
});


app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} 에서 서버 실행 중`);
});

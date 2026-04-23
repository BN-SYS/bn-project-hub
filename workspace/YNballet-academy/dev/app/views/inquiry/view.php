<!-- SCREEN: 문의 상세 | PATH: /inquiry/:id -->

<div class="page-banner">
  <span class="en-label">Contact</span>
  <h1>문의 상세</h1>
  <div class="gold-divider"></div>
</div>

<div class="container py-5" style="max-width:680px;">

  <div class="reveal">
    <table class="yn-table w-100 mb-4" style="border-collapse:collapse;">
      <tbody>
        <tr>
          <th style="width:110px;padding:.85rem 0;font-size:.82rem;color:var(--navy);font-weight:600;letter-spacing:.05em;border-bottom:1px solid var(--ivory-dark);vertical-align:top;">이름</th>
          <td style="padding:.85rem 1rem;font-size:.9rem;border-bottom:1px solid var(--ivory-dark);"><?= e(maskName($inquiry['name'])) ?></td>
        </tr>
        <tr>
          <th style="width:110px;padding:.85rem 0;font-size:.82rem;color:var(--navy);font-weight:600;letter-spacing:.05em;border-bottom:1px solid var(--ivory-dark);vertical-align:top;">연락처</th>
          <td style="padding:.85rem 1rem;font-size:.9rem;border-bottom:1px solid var(--ivory-dark);"><?= e($inquiry['contact']) ?></td>
        </tr>
        <tr>
          <th style="width:110px;padding:.85rem 0;font-size:.82rem;color:var(--navy);font-weight:600;letter-spacing:.05em;border-bottom:1px solid var(--ivory-dark);vertical-align:top;">관심 과정</th>
          <td style="padding:.85rem 1rem;font-size:.9rem;border-bottom:1px solid var(--ivory-dark);"><?= e($inquiry['course_interest'] ?: '—') ?></td>
        </tr>
        <tr>
          <th style="width:110px;padding:.85rem 0;font-size:.82rem;color:var(--navy);font-weight:600;letter-spacing:.05em;border-bottom:1px solid var(--ivory-dark);vertical-align:top;">상태</th>
          <td style="padding:.85rem 1rem;border-bottom:1px solid var(--ivory-dark);"><?= inquiryBadge((int)$inquiry['status']) ?></td>
        </tr>
        <tr>
          <th style="width:110px;padding:.85rem 0;font-size:.82rem;color:var(--navy);font-weight:600;letter-spacing:.05em;border-bottom:1px solid var(--ivory-dark);vertical-align:top;">작성일</th>
          <td style="padding:.85rem 1rem;font-size:.9rem;border-bottom:1px solid var(--ivory-dark);"><?= fmtDate($inquiry['created_at']) ?></td>
        </tr>
        <tr>
          <th style="width:110px;padding:.85rem 0;font-size:.82rem;color:var(--navy);font-weight:600;letter-spacing:.05em;vertical-align:top;">내용</th>
          <td style="padding:.85rem 1rem;font-size:.9rem;line-height:1.8;"><?= nl2br(e($inquiry['content'])) ?></td>
        </tr>
      </tbody>
    </table>
    <?php if (!empty($inquiry['answer'])): ?>
    <div style="background:var(--ivory);border-left:3px solid var(--navy);padding:1.25rem 1.5rem;margin-top:1.5rem;margin-bottom:1.5rem;">
      <p style="font-size:.78rem;font-weight:600;color:var(--navy);letter-spacing:.06em;margin-bottom:.6rem;">YN발레아카데미 답변</p>
      <p style="font-size:.9rem;line-height:1.8;margin:0;white-space:pre-line;"><?= e($inquiry['answer']) ?></p>
    </div>
    <?php endif; ?>

    <div class="text-end">
      <a href="<?= BASE_PATH ?>/inquiry" class="btn btn-yn-outline-navy btn-sm">목록으로</a>
    </div>
  </div>

</div>

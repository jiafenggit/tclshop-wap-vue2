<template>
  <div class="usercenter">
    <div class="billtitle bor-bott"> 订单详情 </div>
    <div class="billdetail-info-billstatus J-GoodsInfor w90 bor-bott">
      <div class="row">
        <span>订单编号：</span><span class="J-Number"></span>
      </div>
      <div class="row">
        <span>订单状态：</span><span class="J-Type"></span>
      </div>
    </div>
    <div class="billdetail-info-status J-Status w90">
      <ul>
        <li>
          <div class="status J-Od">下单</div>
          <i class="tge1"></i>
        </li>
        <li>
          <div class="status J-Pm">付款</div>
          <i class="tge2"></i>
        </li>
        <li>
          <div class="status J-Sp">发货</div>
          <i class="tge3"></i>
        </li>
        <li>
          <div class="status J-Ts">交易成功</div>
          <i class="tge4"></i>
        </li>
        <li>
          <div class="status J-Tor">评价</div>
          <i class="tge5"></i>
        </li>
      </ul>
    </div>
    <div class="plan w90 J-Plan">
      <ul>
        <li class="circle1"></li>
        <li class="circle2"></li>
        <li class="circle3"></li>
        <li class="circle4"></li>
        <li class="circle5"></li>
      </ul>
      <p class="bor-top"></p>
    </div>
    <div class="billdetail-info-status-time J-StatusTime w90 bor-bott">
      <ul>
        <li class="active">
          <div class="time"></div>
        </li>
        <li>
          <div class="time"></div>
        </li>
        <li>
          <div class="time"></div>
        </li>
        <li>
          <div class="time"></div>
        </li>
        <li>
          <div class="time"></div>
        </li>
      </ul>
    </div>
    <div class="billgoods billdetail-goods-info J-BillGoods">
    </div>
    <div class="billdetail-info-message w90 bor-bott">
      <div class="row">
        <span class="m_label">收货地址：</span>
        <span class="m_content J-saddress"></span>
      </div>
      <div class="row">
        <span class="m_label">收货人名： </span>
        <span class="m_content J-sName"></span>
      </div>
      <div class="row">
        <span class="m_label">联系电话： </span>
        <span class="m_content J-sPhone"></span>
      </div>
      <div class="row">
        <span class="m_label">发票类型：</span>
        <span class="m_content J-invType">
    </span>
      </div>
      <div class="row">
        <span class="m_label">发票抬头：</span>
        <span class="m_content J-InvoiceP">
    </span>
      </div>
    </div>
    <div class="billdetail-goods-total w90 bor-bott">
      <div class="billdetail-goods-total-content">
        <div class="row">
          <span class="fl">金额：</span>
          <span class="fl B-prices"></span>
        </div>
        <div class="row">
          <span class="fl">优惠：</span>
          <span class="fl B-Offers"></span>
        </div>
        <div class="row">
          <span class="fl">运费：</span>
          <span class="fl B-freight"></span>
        </div>
        <div class="row">
          <span class="fl">积分抵扣：</span>
          <span class="fl B-integral"></span>
        </div>
        <div class="row">
          <span class="fl">合计：</span>
          <span class="fl red B-totprice"></span>
        </div>
      </div>
    </div>
    <div class="J-PayDeposit">
    </div>
    <div class="w90">
      <p class="Totaltext J-totalM fl">实付总额: <span class="B-totprice"></span></p>
      <i class="J-Await fl"></i>
      <a class="button J-vWuliu fl"></a>
      <a class="button J-cReceipt fr"></a>
    </div>
  </div>
</template>

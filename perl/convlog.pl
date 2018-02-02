#!/usr/bin/perl -T

use strict;
use warnings;
use JSON qw(to_json);

my %type;

sub type {
    my ($type) = @_;
    $type{demo}     = ! (0x0001 & $type);
    $type{hongpai}  = ! (0x0002 & $type);
    $type{ariari}   = ! (0x0004 & $type);
    $type{dongfeng} = ! (0x0008 & $type);
    $type{sanma}    =   (0x0010 & $type);
    $type{soku}     =   (0x0040 & $type);
    $type{level}    =   (0x0020 & $type) >> 4 | (0x0080 & $type) >> 7;

    return  ($type{sanma}    ? '三' : '四')
          . ('般','上','特','鳳')[$type{level}]
          . ($type{dongfang} ? '東' : '南')
          . ($type{ariari}   ? '喰' : '')
          . ($type{hongpai}  ? '赤' : '')
          . ($type{soku}     ? '速' : '');
}

my @dan_name = (
    '新人','9級','8級','7級','6級','5級','4級','3級','2級','1級',
    '初段','二段','三段','四段','五段','六段','七段','八段','九段','十段',
    '天鳳位'
);

sub url_decode {
    my ($str) = @_;
    $str =~ s/%([\da-fA-F]{2})/pack('H2', $1)/ge;
    return $str;
}

sub player {
    my %attr = @_;
    my @name = map { url_decode($attr{$_}) } ('n0','n1','n2','n3');
    my @dan  = map { $dan_name[$_] } split(',', $attr{dan});
    my @rate = map { int($_) } split(',', $attr{rate});
    my @player = map { "$name[$_]\n($dan[$_] R$rate[$_])" } (0..3);
    return \@player;
}

sub pai {
    my $pai = '';
    my $suit = '';
    for (sort {$a<=>$b} @_) {
        my $s = ('m','p','s','z')[$_/36];
        $pai .= $s      if ($s ne $suit);
        $suit = $s;
        my $n = int($_ % 36 / 4) + 1;
        $n = 0      if ($type{hongpai} && $s ne 'z' && $n == 5 && $_ % 4 == 0);
        $pai .= $n;
    }
    return $pai;
}

sub mianzi {
    my ($m) = @_;
    my $d = ('','+','=','-')[$m & 0x0003];
    if ($m & 0x0004) {
        my $p = ($m & 0xFC00)>>10;
        my $r = $p % 3;
        $p = int($p / 3);
        my $s = ('m','p','s')[$p/7];
        my $n = $p % 7 + 1;
        my @n = ($n, $n+1, $n+2);
        my @p = ($m & 0x0018, $m & 0x0060, $m & 0x0180);
        for (my $i = 0; $i < @n; $i++) {
            $n[$i]  = 0     if ($type{hongpai} && $n[$i] == 5 && $p[$i] == 0);
            $n[$i] .= $d    if ($i == $r);
        }
        return $s.join('', @n);
    }
    elsif ($m & 0x0018) {
        my $p = ($m & 0xFE00)>>9;
        my $r = $p % 3;
        $p = int($p / 3);
        my $s = ('m','p','s','z')[$p/9];
        my $n = $p % 9 + 1;
        my @n = ($n, $n, $n, $n);
        if ($type{hongpai} && $s ne 'z' && $n == 5) {
            if (($m & 0x0060) == 0) { $n[3] = 0 }
            elsif ($r == 0)         { $n[2] = 0 }
            else                    { $n[1] = 0 }
        }
        return ($m & 0x0010) ? $s.join('', @n[0,1,2]).$d.$n[3]
                             : $s.join('', @n[0,1,2]).$d;
    }
    else {
        my $p = ($m & 0xFF00)>>8;
        my $r = $p % 4;
        $p = int($p / 4);
        my $s = ('m','p','s','z')[$p / 9];
        my $n = $p % 9 + 1;
        my @n = ($n, $n, $n, $n);
        if ($type{hongpai} && $s ne 'z' && $n == 5) {
            if    ($d eq '') { $n[3] = 0 }
            elsif ($r == 0)  { $n[3] = 0 }
            else             { $n[2] = 0 }
        }
        return $s.join('', @n).$d;
    }
}

sub qipai {
    my %attr = @_;

    my @seed = split(',', $attr{seed});
    my @ten = map { $_ * 100 } split(',', $attr{ten});
    my @hai = map { pai(split(',', $attr{"hai$_"})) } (0..3);

    push(@ten, splice(@ten, 0, $attr{oya}));
    push(@hai, splice(@hai, 0, $attr{oya}));

    my %qipai = (
        zhuangfeng  => int($seed[0] / 4),
        jushu       => $seed[0] % 4,
        changbang   => $seed[1] + 0,
        lizhibang   => $seed[2] + 0,
        defen       => \@ten,
        baopai      => pai($seed[5]),
        shoupai     => \@hai
    );
    return { qipai => \%qipai };
}

my $oya;

my @hupai_name = (
    '門前清自摸和', '立直', '一発', '槍槓', '嶺上開花',
    '海底摸月', '河底撈魚', '平和', '断幺九', '一盃口',
    '自風 東', '自風 南', '自風 西', '自風 北', '場風 東',
    '場風 南', '場風 西', '場風 北', '役牌 白', '役牌 發',
    '役牌 中', '両立直', '七対子', '混全帯幺九', '一気通貫',
    '三色同順', '三色同刻', '三槓子', '対々和', '三暗刻',
    '小三元', '混老頭', '二盃口', '純全帯幺九', '混一色',
    '清一色', '', '天和', '地和', '大三元',
    '四暗刻', '四暗刻単騎', '字一色', '緑一色', '清老頭',
    '九蓮宝燈', '純正九蓮宝燈', '国士無双', '国士無双１３面', '大四喜',
    '小四喜', '四槓子', 'ドラ', '裏ドラ', '赤ドラ',
);

sub hule {
    my %attr = @_;

    $attr{m} .= '';
    $attr{yaku} .= '';
    $attr{yakuman} .= '';

    my @ten     = split(',', $attr{ten});
    my @sc      = map { $_ * 100 } (split(',', $attr{sc}))[1,3,5,7];
    my @yaku    = split(',', $attr{yaku});
    my @yakuman = split(',', $attr{yakuman});

    push(@sc, splice(@sc, 0, $oya));

    my (@hupai, $fanshu);
    if (@yakuman) {
        for (@yakuman) {
            push(@hupai, { name => $hupai_name[$_], fanshu => '*' });
        }
    }
    else {
        for (my $i = 0; $i < @yaku; $i += 2) {
            push(@hupai, { name   => $hupai_name[$yaku[$i]],
                           fanshu => $yaku[$i+1] + 0 });
            $fanshu += $yaku[$i+1];
        }
    }

    my %hule = (
        l        => ($attr{who} + 4 - $oya) % 4,
        shoupai  => join(',',
                        pai(grep { $_ ne $attr{machi} } split(',', $attr{hai}))
                            . pai($attr{machi}),
                        reverse map { mianzi($_) } split(',', $attr{m})),
        baojia   => ($attr{who} ne $attr{fromWho})
                        ? ($attr{fromWho} + 4 - $oya) % 4 : undef,
        fubaopai => (defined $attr{doraHaiUra})
                        ? [ map { pai($_) } split(',', $attr{doraHaiUra}) ]
                        : undef,
        defen    => $ten[1] + 0,
        hupai    => \@hupai,
        fenpei   => \@sc
    );
    if (@yakuman) {
        $hule{damanguan} = @yakuman;
    }
    else {
        $hule{fu}     = $ten[0] + 0;
        $hule{fanshu} = $fanshu;
    }
    return { hule => \%hule };
}

my @fulou;

my %pingju_name = (
    nm      => '流し満貫',
    yao9    => '九種九牌',
    kaze4   => '四風連打',
    reach4  => '四家立直',
    ron3    => '三家和了',
    kan4    => '四槓散了',
);

sub pingju {
    my %attr = @_;

    my @sc  = map { $_ * 100 } (split(',', $attr{sc}))[1,3,5,7];
    my @hai = map {
                (defined $attr{"hai$_"})
                    && join(',', pai(split(',', $attr{"hai$_"})), @{$fulou[$_]})
             } (0..3);

    push(@sc,  splice(@sc, 0,  $oya));
    push(@hai, splice(@hai, 0, $oya));

    my %pingju = (
        name    => defined $attr{type} ? $pingju_name{$attr{type}} : '流局',
        shoupai => \@hai,
        fenpei  => \@sc
    );
    return { pingju => \%pingju };
}

my $paipu = {};

my $log;
my $zimo;
my $gang;
my $baopai;
my $lizhi;

for (join('', <STDIN>) =~ /<.*?>/g) {
    my ($elem, $attr) = /^<(\/?\w+)(.*?)\/?>$/;
    my %attr = $attr ? ($attr =~ /\s+(\w+)="(.*?)"/g) : ();

    if ($elem eq 'mjloggm') {
        warn "*** Unknown version $attr{ver}\n" if ($attr{ver} ne '2.3');
    }
    elsif ($elem eq 'GO') {
        $paipu->{title} = type($attr{type});
        $paipu->{title} .= "\n@ARGV"    if (@ARGV);
        die "+++ Not Majiang log\n" if ($type{sanma});
    }
    elsif ($elem eq 'UN' && ! $paipu->{player}) {
        $paipu->{player} = player(%attr);
    }
    elsif ($elem eq 'TAIKYOKU') {
        $paipu->{qijia} = $attr{oya} + 0;
        $paipu->{log}   = [];
    }
    elsif ($elem eq 'INIT') {
        @fulou = ( [], [], [], [] );
        $oya = $attr{oya};
        undef $gang;
        $log = [ qipai(%attr) ];
        push(@{$paipu->{log}}, $log);
    }
    elsif ($elem =~ /^([TUVW])(\d+)$/) {
        my $l = (ord($1) - ord('T') + 4 - $oya) % 4;
        my $p = pai($2);
        if ($gang) {
            push(@$log, { gangzimo => { l => $l, p => $p} });
        }
        else {
            push(@$log, { zimo => { l => $l, p => $p} });
        }
        $zimo = $2;
        undef $gang;
        if ($baopai) {
            push(@$log, { kaigang => { baopai => $baopai } });
            undef $baopai;
        }
    }
    elsif ($elem =~ /^([DEFG])(\d+)$/) {
        my $l = (ord($1) - ord('D') + 4 - $oya) % 4;
        my $p = pai($2);
        $p .= '_'   if ($2 eq $zimo);
        $p .= '*'   if ($lizhi);
        push(@$log, { dapai => { l => $l, p => $p} });
        undef $lizhi;
        if ($baopai) {
            push(@$log, { kaigang => { baopai => $baopai } });
            undef $baopai;
        }
    }
    elsif ($elem eq 'N') {
        my $l = ($attr{who} + 4 - $oya) % 4;
        my $m = mianzi($attr{m});
        if ($m =~ /^[mpsz]\d{4}$/ || $m =~ /^[mpsz]\d{3}[\-\+\=]\d$/) {
            push(@$log, { gang => { l => $l, m => $m } });
            $gang = 1;
        }
        else {
            push(@$log, { fulou => { l => $l, m => $m } });
            if ($m =~ /^[mpsz]\d{4}[\-\+\=]$/) { $gang = 1  }
            else                               { $zimo = '' }
        }
        push(@{$fulou[$attr{who}]}, $m);
    }
    elsif ($elem eq 'DORA') {
        if ($baopai) {
            push(@$log, { kaigang => { baopai => $baopai } });
            undef $baopai;
        }
        $baopai = pai($attr{hai});
    }
    elsif ($elem eq 'REACH' && $attr{step} == 1) {
        $lizhi = 1;
    }
    elsif ($elem eq 'AGARI') {
        push(@$log, hule(%attr));
    }
    elsif ($elem eq 'RYUUKYOKU') {
        push(@$log, pingju(%attr));
    }

    if ($attr{owari}) {
        my @owari = split(',', $attr{owari});
        $paipu->{defen} = [ map { $_ * 100 } @owari[0,2,4,6] ];
        $paipu->{point} = [ @owari[1,3,5,7] ];

        my @rank  = (0, 0, 0, 0);
        for (my $i = 0; $i < 4; $i++) {
            for (my $j = 0; $j < 4; $j++) {
                if ($j <= $i) {
                    $rank[($paipu->{qijia} + $i) % 4]++
                        if ($paipu->{defen}[($paipu->{qijia} + $j) % 4]
                                >= $paipu->{defen}[($paipu->{qijia} + $i) % 4]);
                }
                else {
                    $rank[($paipu->{qijia} + $i) % 4]++
                        if ($paipu->{defen}[($paipu->{qijia} + $j) % 4]
                                > $paipu->{defen}[($paipu->{qijia} + $i) % 4]);
                }
            }
        }
        $paipu->{rank} = \@rank;
    }
}

print to_json($paipu);

import { defineConfig } from 'vite';
import monkey, { cdn } from 'vite-plugin-monkey';

const VERSION = '4.9.2';
// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  let downloadURL: string | undefined;
  let updateURL: string | undefined;
  let outDir: string | undefined;
  let emptyOutDir = true;
  if (command === 'build') {
    downloadURL = 'https://github.com/MapoMagpie/eh-view-enhance/raw/master/eh-view-enhance.user.js';
    updateURL = 'https://github.com/MapoMagpie/eh-view-enhance/raw/master/eh-view-enhance.meta.js';
    outDir = '';
    emptyOutDir = false;
  }
  return {
    define: {
      _VERSION_: `"${VERSION}"`,
    },
    build: {
      target: 'esnext',
      outDir,
      emptyOutDir,
    },
    server: {
      host: '0.0.0.0',
    },
    plugins: [
      monkey({
        entry: 'src/main.ts',
        userscript: {
          version: VERSION,
          icon: 'data:image/x-icon;base64,AAABAAEAQEAAAAEAIAAoQgAAFgAAACgAAABAAAAAgAAAAAEAIAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAADF2+r/xdzo/8Xc6P/F3Oj/xdzo/8Xc6P/F3Oj/xdzo/8Xc6P/F3Of/xdzn/8Xc5//F3Oj/xdzo/8Xc6P/F3Oj/xdzo/8Tb5//E2+f/xdzo/8Xc6P/F3Oj/xdzo/8Xc6P/F3Oj/xdzo/8Xc6P/F3Oj/xdzo/8Xc6P/F3Oj/xdzo/8Xc6P/F3Oj/xdzo/8Xc6P/E2+f/xNvn/8Xb6P/E3Of/xNvn/8Tb5//F3Oj/xdzo/8Xc6P/F3Oj/xdzo/8Xc6P/F3Oj/xNvn/8Tb5//E2+f/xNvn/8Xc6P/F3Oj/xdzo/8Xc6P/F3Oj/xdzo/8Xc6P/F3Oj/xdzo/8Xc6P/F3Oj/xdvp/8Xd5//F3eb/xd3m/8Xd5//F3ef/xd3n/8Xd5//F3ef/xd3n/8Xd5//F3ef/xd3n/8Xd5//F3eb/xd3m/8Xd5v/F3eb/xd3m/8Xe5//F3eb/xd3m/8Xd5v/F3eb/xd3m/8Xd5//F3eb/xd3m/8Xd5//F3eb/xd3m/8Xd5v/F3eb/xd3n/8Xd5//F3ef/xd3n/8Xd5//E3OX/w9vm/8Tc5//D2+X/wtvk/8Xd5//F3eb/xd3m/8Xd5v/F3eb/xd3m/8Xd5v/F3ef/xd3n/8Xe5v/F3uf/xd3m/8Xe5v/F3eb/xd3n/8Xd5v/F3eb/xd3n/8Xd5//F3ef/xdzo/8Xb6f/F3eb/xd7l/8Xe5f/D3uX/xN7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xN7l/8Te5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5P/F3uT/xd3k/8Xd5P/F3eT/xd3k/8Xd5P/E3OP/zeXr/9Dm6//N4uf/0uju/9Hq8f/H4On/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5v/F3ef/xd3n/8Xd6f/F2ur/xd3n/8Xe5f/E3uX/w97l/8Pe5f/F3uX/xN3k/8Xd5P/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uT/xd3k/8Xd5P/F3eT/xd3k/8Xd5P/F3eP/xN3j/8Td4//E3eT/xN3k/8Td5P/E3eT/xN3l/8Pe5f/D3ub/xN/n/8Tf6P/E4Oj/xOHp/8Xh6//F4Or/0ez2/5aquv9YZ4X/YXGQ/1Jbd/+LmKj/yd3l/8be5//F3uT/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/E3uX/xd7m/8Xd5//F3ej/xdrq/8Xd5//F3uX/xd7l/8Te5f/F3uX/xd7l/8ji6v/G4Oj/xN3l/8Tc5P/E3eT/xN3k/8Pd5f/E3uf/xN/o/8Tf6P/E3+r/xOHq/8bi7P/G4+z/x+Tu/8jl7v/J5e//y+Xv/8vl7v/M5e3/zeXs/87k6v/P4uj/z+Dj/9De3//O2dr/zdXV/8zRzv/IysX/xMK8/8rEvv+Ng4P/T2yk/01spv8ZKmj/DCBs/3yFmP/b8fj/w93p/8Td5f/E3eT/xd7l/8Td5P/E3eT/xN3k/8Xe5f/F3uX/xd7l/8Xe5f/E3uX/w97l/8Te5f/F3uX/xd7l/8Xe5f/F3ef/xd3n/8Xb6v/F3ef/xd7l/8Xe5f/F3uX/xt7m/8fd5P+6ztP/xNnd/8zj6f/N5/D/zubu/87l7P/O4+j/z+Hk/8/e3//O2tr/ztXU/8vQzv/Iy8f/xcS+/8K7tP+9s6v/uayj/7Okmv+unZL/p5WK/6CNg/+ZhXz/kn14/4p2dP+CcXT/e21y/3Rpcv9vZXL/aWRy/2Nhdf9hZH3/VFNn/0BSf/9JZqf/IjNy/x45jf9DP1f/tqid/9DT0P/P4+r/yePv/8Pd5v/G4Oj/yuTs/8rj6//D3eT/xN3k/8Xe5f/E3uX/w97l/8Te5f/F3uX/xd7l/8Xe5f/F3uX/xd3n/8Xd6P/F2ur/xd3n/8Xe5f/F3uX/w9zj/8/n7/+Il6v/QVF8/y07af9laHv/r6KZ/5+Ph/+Zh3//kH95/4l4dP+EdHT/fW9z/3drcv9yaXP/bGZ1/2Zjd/9fYHj/Wl99/1phg/9VYYf/UWGN/1BklP9PZpr/T2mi/01sqf9NcLD/UXS5/1F4vv9Te8P/VX3H/1eAzP9Ygc3/XojX/0lpr/8+Tnv/VXOv/yU1dv8eLWn/GiZT/y8zWP9uW2H/n4yE/8XAuf/V4uT/xNnf/7HE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h/+4ytP/yuLs/8bc5//E2ur/xNvl/8vl7P+sv8v/Exkp/xsqQf84RGr/pqyu/0BNbv9bitj/PViW/zdKf/8dMHX/b3GI/9DOy/++vL3/v769/8vJxf/KycT/yMbC/8fEwP/Ewb3/wb65/7+7tv+/u7X/vbmz/7q2sf+2tK//tbOu/7Wyrv+zsav/sK6p/7Ctqf+tqqf/qqmk/6elov+urKf/iYyQ/x4qVP8jLFz/YYzT/1uFyv8uPGj/O0+J/0RZj/9EXZb/MEiO/0tmpv9AT3z/LkWN/zZUqf9BS3L/b4ey/2uEsv9pg7L/aYS0/2R9rf9bdKb/Ljts/yYxYf88Unj/uczV/8nh6//F3ef/xdrq/8La5P/V7PP/ZG+C/xAePP8pO2H/NENx/2Bqfv9cZ4H/VITT/0Jdm/9feqX/MU+b/8PDyv////////////////////////////////////////////////////////////////////////////////////7////9/////P////v///76///9+f/7+vb////+/56ptP83Uof/Lzx6/2CM0v9ahMj/O057/0FXk/85S4L/Lj5u/yU6fP9NaKr/VmaI/zBIkf8cMYD/e4aU/9rx8v/J3uP/zOHl/8vf4//R5Ob/cIKb/y8+a/85T43/SFWA/8nd4v/G3ej/xt3n/8Xa6f/G3Of/y+Dn/0BJZ/8hNF3/KThp/1Rffv80R33/NUBh/12M2v84UpP/aYCi/y9Gi/9hZ4X/p6Wm/6Ojqv+trbD/t7e5/7u6vP++vb//wcDC/8XExf/Jycn/zc3N/9DQ0P/S0tL/1tXW/9rZ2f/d3Nz/4N/e/+Tj4f/n5eT/6ujn/+3s6v/w7+7/8PDv//36+P+grLj/U22a/yw6df9gjNP/WYPH/z1Qe/89U4z/HilS/z5Siv8vS5v/UG2s/1Vrjf8UGDf/VVtw/7nO1v/H4en/w9zk/8Td5f/C2+P/zOft/5iouf8sOmD/M0Nr/4KRov/R6fH/xNvk/8bd6P/E2un/yd/q/77S2f84RWf/KkBq/yo4av9KVHf/Jzdu/yk5af9ijtj/MUmO/0VYfv8+T3f/DxhT/xQgV/8ULH7/QU11/9LNyP/X0tH/0c3L/9DMyv/Mysb/ycbD/8XDv//Dwb7/wL68/768uv+9urn/vbm3/7u4tv+4t7T/trWy/7Sysv+ysK//sLCu/66urv+xsK//lpqg/01olP8fK1r/YIzR/1mDyv8+UHv/RFmN/yU2Z/8wQXb/MEF2/0Vckf8+UoD/Gh00/8bY3f/N5+7/w9zj/8Xe5f/F3uX/xd7l/8Td5P/L4+r/nq+6/5Skrf/J4uj/xd7m/8Xd5//H3ef/xNrp/8ng6v+80dj/PElp/ylAav9IVYT/p621/xokUP8nNWP/ZI7Y/zZPlP8uPnT/Ok58/xkfSP8YH0L/Ex5F/zg7Tf+WjYH/oJOI/6SVif+rmIz/sJyN/7ehkP+6ppP/vqqX/8Owmv/Isp3/zbWh/9C6pf/Svqn/1sKt/9rIsf/czbb/38+8/+PTwP/l1sT/5tnJ/+3ezv+enaL/RE5t/1yIy/9bhsv/RliF/05ilP8rPHb/LD58/x8pVP8bI0v/KTRs/yQrUP+zxMr/yePq/8Td5P/F3uX/xd7l/8Xe5f/F3uX/xN3k/87o7v/Q6vH/xd7l/8Xe5f/F3ef/xt3o/8Xa6f/H3ef/x93m/1Bbcv8vRm3/MUFw/ycuUv8YIVP/NkNq/2KL2f82TpH/MUWC/zBBgP8pNWv/JC9j/yIrWv8nMV3/LDhi/y04Yv8uOGH/LTdd/y41XP8uNVr/LzdY/zE3Vv8yNlP/NDdS/zY5Uf83O0//OzxP/zw8Tv8+PU3/QT9N/0NCTf9IRE7/S0ZP/0xIT/9RTFT/U0pO/zY4SP9ei9H/XIjM/0JVhv9QZZn/Lj5v/yQvXf8sO3b/MUB1/yo6ef9NVXX/zuLo/8Te5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/D3OP/w9zj/8Xe5f/F3uX/xd3n/8Xd6P/F2+r/xNrk/9Lp8f9zgJH/KDlT/y5Dcv8bJVD/gIyd/3SFov9Vf8//OFGW/y5Bfv87UJT/Q1ik/0Rdp/9HZK3/Smat/0hlqf9JZKj/SGGm/0VepP9EXaP/Q1yi/0Baof89WJz/O1SZ/ztTlf88UJH/Ok6Q/zlMjv82Sor/NEeG/zRGhv8yRYX/LkJ//yw/ev8rPnn/JjZt/yk9dP81S4H/XojM/16L0f83TYP/SFuO/ztPh/8rNmL/KjNV/zM+bf8lM2//aHSR/9Xt8//C2+L/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xd5//F3ej/xtvq/8Tc5f/J4+n/uMvX/yw2Sf8cLFL/V2KB/+7++/93iqr/U3/M/zhTlv8vQn//Ok+Q/0Vcov9JZKr/Wnu//2GDx/9kiMz/ZYnO/2WL0P9mjNL/ZozU/2SO1P9lj9X/ZI7V/2WN0/9ljNL/Y4rR/2OJz/9ih83/YIbK/1+Fyv9eg8v/XYPN/1yCzP9agcr/WXzH/0BfrP84U5z/RV+f/12Gy/9gjdL/OlKI/ys3aP81RHL/IitY/y05Zf8wO2X/GCJe/2t3lP/R6u7/wtvj/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/w97l/8Xe5f/F3uX/xd7l/8Xe5f/F3ef/xd3n/8Xb6v/G3ef/w9zj/87n7v+ktcH/P0ha/yErVP9SVWf/T1x4/12I1P85UpX/LT1v/yY2aP8gKlb/LDhn/0tXe/9GU3j/P050/0VUev9HWYH/RVmE/0Vahv9FW4n/RVuN/0ZdkP9JX5H/S2GU/0tilv9MZZv/S2ac/0xnoP9OaKT/Tmmk/09qpv9Sban/U2+r/05sqv83Upj/NkyM/z1Of/9fiM7/YYzU/zpPgv8hLWT/LTt0/y46cP8zPGH/Lzhb/xYgXv94hqD/0uvw/8Lb4v/F3uX/xd7l/8Xe5f/D3uX/w97l/8Pe5f/F3uX/xd7l/8Xe5f/F3uX/xd3n/8Xd6P/E2ur/xd3n/8Xe5f/D3OP/zeft/8/l7f+Xp7T/eISS/2Bxj/9Zgcr/NUuO/zI9ZP86Rmj/SVVw/x4tX/99hJn/eX6S/wUNQP+HlKL/s8XO/6O0v/+gsLz/nKu4/5eltP+SoLD/jZus/4iVqf+BjqP/fImf/3eEm/90gJb/cHqR/2x1jP9ncIj/YmyF/1xng/9WYoH/S1Nw/0ZYh/9DV4r/YorM/12Kz/9FW4//MTpd/y09ef8zQnf/Pkx9/y4zWP8XIWD/j52x/9Dq7//C2+P/xd7l/8Xe5f/F3uX/w97l/8Pe5f/F3uX/xd7l/8Xe5f/F3uX/xd7m/8Xd5//F3uf/xdrq/8Xd5//F3uX/xd7l/8Pc4//E3eT/zObt/9/4+/98kKr/T3a7/y1Agv8bKFr/h5Oj/258mf98iaD/R1Fz/yovTP8fKVz/tsjQ/9Tt9P/M5uz/zuju/87p7//P6vD/0Orw/9Hr8P/R6/H/0urw/9Pr8P/S6/D/0urv/9Hp7v/Q6O3/z+fs/8/l6//O5er/zeTq/8/g5P9keaf/FCVc/0tspv9kkNT/Ok6D/yMsVf8rN2X/LDtq/zVGff8hJkr/ICtm/6e3xf/M5u3/w9zj/8Xe5f/F3uX/w97l/8Pe5f/E3uX/xd7l/8Xe5f/E3uX/xN7l/8Xe5v/F3ef/xd3o/8Xa6v/F3ef/xd7l/8Xe5f/F3uX/xd7l/8HZ4f/N5uz/jJ6u/1R4t/80SpH/Hyhb/8XQ0P9ebYv/wtDZ/4OOnP8EDD//P0lw/8fd4f/D3OT/w9zj/8Pc4//D3OP/w9zj/8Pb4//D2+P/wtvj/8Lb4//C2+P/wtvj/8Pc4//D3OP/w9zj/8Pc5P/E3eT/xd7l/8Td5P/K4ur/g5Sq/256kv9Zcpn/YIjK/ztUjv8uOGX/V112/0lVff9MWXr/ERlG/zZDd/+/09v/yOHo/8Td5P/F3uX/xd7l/8Pe5f/D3uX/w97l/8Pe5f/D3uX/w97l/8Xe5f/F3uX/xd3n/8Xc6f/F2ur/xd3m/8Xe5f/F3uX/xd7l/8Xe5f/E3eT/yeTr/7PGzv9cean/RF+j/xolZ/90fpT/aHSJ/3+Hlf86Q2v/ER1a/3N/kv/T7PH/wtvi/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8vj6v/a8PX/d4um/1l+u/9IY6P/Rk1x/5CWpP9aaI3/cneE/xEfZv9bZ4v/0Obt/8Pc5P/F3uX/xd7l/8Pe5f/E3uX/w97l/8Pe5f/D3uX/w97l/8Pe5f/E3uX/xd7l/8Xd5//F3ej/xdvq/8Xd5v/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Pc4//O5uz/fpCn/0prrP8rOXn/Hi9w/yYyW/8cJVD/FSJf/yQsVP+7zdT/yePq/8Td5P/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/B2uL/y+Tr/6Cwvv9ScaH/XHy3/z5Nff9naXj/JCxG/y86bf8aKGj/kaCv/9Hp8v/D2+P/xd7l/8Xe5f/D3uX/xd7l/8Te5f/D3uX/w97l/8Pe5f/D3uX/w97l/8Xe5f/F3ef/xd3n/8Xa6v/F3ef/xd7l/8Pe5f/D3uX/w97l/8Xe5f/E3eT/x+Ho/7/T2/9ieJ7/PE+F/xkiWv8WJmf/FyVi/yMrUf+Wo67/zufu/8DZ4f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Te5f/D3uX/w97l/8Xe5f/F3uX/xd7l/8Xe5f/E3uX/xN7l/8Te5f/E3uX/xd7l/8Xe5f/F3uX/xd7l/8Td5P/M4+r/eImf/1Jtov86T4n/Ex1O/xQbS/8QG1j/R09u/8vg6P/F3eX/xd7l/8Xe5f/E3uX/w97l/8Xe5f/F3uX/xd7l/8Pe5f/D3uX/w97l/8Pe5f/F3uX/xd3n/8Xd5//F2ur/xd3n/8Xe5f/D3uX/w97l/8Pe5f/E3uX/xd7l/8Lb4v/S7PL/kqKt/z5Vhf9DTXT/l6Gq/7G/x//G2OD/2fD3/8/n7f/Q6e7/xt/m/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xN7l/8Te5f/E3uX/xd7l/8Xe5f/F3uX/xN7l/8Xe5f/E3uX/xN7l/8Xe5f/F3uX/xd7l/8Xe5f/F3eT/xuDn/8bd5P+ClKn/XGuM/zxHbv8rOWj/Ult1/7vO1//J4+r/xN3k/8Xe5f/F3uX/xd7l/8Te5f/E3uX/xd7l/8Te5f/D3uX/w97l/8Pe5f/D3uX/xd7l/8Xd5//F3ej/xdvp/8Xd5//F3uX/w97l/8Pe5f/D3uX/w97l/8Te5f/E3eT/yuTr/6/Dzf84TX//bXyY/5+quf9rdYv/prfE/6O2xv+Yqbz/nK2+/8Tc5f/G3+b/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xN7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Td5P/G3+b/zebs/8rg5f/E2N3/v9PX/9Dn7P/J4un/w93k/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Te5f/D3uX/w97l/8Pe5f/D3uX/xd7l/8Xe5f/F3ef/xd3o/8Xb6f/F3ef/xd7l/8Xe5f/E3uX/w97l/8Pe5f/D3uX/xN3k/8rk6/+vw8v/SWWb/z9QeP8hNXL/HjR5/zlBZv9JWYL/R1iB/05cff+4zNb/yeLq/8Td5P/E3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xN7l/8Pe5f/E3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Pc5P/E3uX/xuDn/8jh6f/D3OT/xN3k/8Xe5f/F3uX/xd7l/8Xe5v/F3uX/xd7l/8Xe5f/E3uX/xN7l/8Te5f/D3uX/xN7l/8Xe5f/F3uX/xd3n/8Xd6P/F2+j/xd3n/8Xe5f/F3uX/xd7l/8Xe5f/E3uX/xd7l/8Xe5f/G4Of/w9nh/26Dnf+Qn7L/lqa5/4iZrf/D1t//wNbc/8Ta3//H3eP/yODn/8Xe5f/G3+b/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/E3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xd5f/E3eT/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/G3+b/xd7l/8Xe5f/F3uX/xN7l/8Te5f/F3uX/xN7l/8Xe5f/F3uX/xd7l/8Xd5//F3ej/xdvp/8Xd5//F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7k/8fg5//K4eb/zuXs/8/o7f/P5+z/yeHo/8jh6P/I4ej/x+Dn/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xt/l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3uX/xd7l/8Xe5f/F3ef/xd3o/8Xc6P/F3ef/xd7m/8Xe5v/F3uf/xd7m/8Xe5v/F3ub/xd7m/8Xe5v/F3ub/xN3m/8Td5f/D3OX/w9zk/8Td5f/F3ef/xd7n/8be5v/F3ub/xd7m/8Xe5//F3ub/xd7m/8Xe5//F3ub/xd7m/8Xe5//F3ub/xd7n/8Xe5v/F3ub/xd7n/8Xe5v/F3ub/xd7n/8Xe5//F3ub/xd7n/8Xe5//F3uf/xd7m/8Xe5//F3uf/xd7m/8Xe5//F3uf/xd7m/8Xe5v/F3uf/xd7n/8be5//F3uf/xd7m/8Xe5v/F3uf/xd7n/8Xe5//F3uf/xd7n/8Xe5//F3ub/xd3m/8bd6v/F3Of/xt3n/8bd5v/G3ub/x97n/8fe5v/H3ub/x97o/8fe5//H3uj/xt/n/8bf5v/G3uf/xt7n/8fe5//H3+b/x97m/8fe5//G3uf/xt7n/8be6P/G3uf/xt7n/8be5v/G3uf/x97m/8fe5v/H3+b/xt7m/8fe5//H3+f/x9/m/8bf5v/G3ub/x9/m/8fe5v/H3uf/xt7n/8be5v/G3uj/xt/n/8bf5v/H3+f/x9/n/8fe5//G3+f/xt/m/8be5v/H3ub/xt7m/8be5//G3uf/xt7n/8bf5//G3+f/x97o/8bf5//G3uf/xt7n/8be5//G3uf/xt7n/8bd6P/G3un/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
          namespace: 'https://github.com/MapoMagpie/eh-view-enhance',
          supportURL: 'https://github.com/MapoMagpie/eh-view-enhance/issues',
          downloadURL,
          updateURL,
          match: ['*://*/*'],
          name: {
            "": "Comic Looms",
            "zh-CN": "漫画织机",
            "zh-TW": "漫畫織機",
            "ja": "コミック織機",
            "ko": "만화 베틀",
            "eo": "Comic Looms",
            "ka": "Comic Looms",
          },
          license: 'MIT',
          author: 'MapoMagpie',
          description: {
            "": "Manga Viewer + Downloader, Focus on experience and low load on the site. Support you in finding the site you are searching for.",
            "zh-CN": "漫画阅读 + 下载器，注重体验和对站点的负载控制。支持你正在搜索的站点。",
            "zh-TW": "漫畫閱讀 + 下載器，注重體驗和對站點的負載控制。支持你正在搜索的站點。",
            "ja": "サイトのエクスペリエンスと負荷制御に重点を置いたコミック閲覧 + ダウンローダー。あなたが探しているサイトを見つけるのをサポートします。",
            "ko": "만화 읽기 + 다운로더, 유저 경험 및 낮은 사이트 부하에 중점을 둡니다. 당신이 검색하고 있는 사이트를 찾는 것을 지원합니다.",
            "eo": `Manga Viewer + Downloader, Focus on experience and low load on the site. Support:  ${["e-hentai | exhentai | E绅士",
              "twitter | x | 推特",
              "instagram",
              "artstation",
              "pixiv",
              "18comic | 禁漫",
              "nhentai",
              "hitomi",
              "rule34 | danbooru | gelbooru | yande",
              "wnacg | 绅士漫画",
              "manhuagui | 漫画柜",
              "mangacopy | 拷贝漫画",
              "hentainexus",
              "koharu",
              "arca",].join(" | ")}`,
            "ka": `Manga Viewer + Downloader, Focus on experience and low load on the site. Support:  ${["e-hentai.org | exhentai.org",
              "twitter.com | x.com",
              "instagram.com",
              "artstation.com",
              "pixiv.net",
              "18comic.vip",
              "nhentai.net | nhentai.xxx",
              "hitomi.la",
              "rule34.xxx | danbooru.donmai.us | gelbooru.com | yande.re",
              "wnacg.com",
              "manhuagui.com",
              "mangacopy.com",
              "hentainexus.com",
              "koharu.to",
              "arca.live",].join(" | ")}
 `,
          },
          connect: ['*'],
          grant: [
            'GM_xmlhttpRequest',
            'GM_setValue',
            'GM_getValue',
          ],
        },
        build: {
          fileName: 'eh-view-enhance.user.js',
          metaFileName: 'eh-view-enhance.meta.js',
          externalGlobals: {
            "@zip.js/zip.js": cdn.jsdelivr("zip", "dist/zip-full.min.js"),
            "file-saver": cdn.jsdelivr("saveAs", "dist/FileSaver.min.js"),
            "pica": cdn.jsdelivr("pica", "dist/pica.min.js"),
          },
          autoGrant: true,
        },
        server: { mountGmApi: false },
      }),
    ],
  };
});

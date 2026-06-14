import os
import shutil
import re

def bundle_project():
    print("正在打包项目（完全自包含版本）...")
    
    dist_dir = "dist"
    if os.path.exists(dist_dir):
        shutil.rmtree(dist_dir)
    os.makedirs(dist_dir)
    
    os.makedirs(os.path.join(dist_dir, "js"), exist_ok=True)
    os.makedirs(os.path.join(dist_dir, "css"), exist_ok=True)
    
    with open("assets/vendor.js", "r", encoding="utf-8") as f:
        vendor_code = f.read()
    
    with open("js/main.js", "r", encoding="utf-8") as f:
        main_code = f.read()
        main_code = main_code.replace('import {\n  C as P,\n  V as $,\n  M as He,\n  a as Ye,\n  D as lt,\n  b as ct,\n  G as mt,\n  c as p,\n  E as j,\n  d as Ae,\n  e as _,\n  f as De,\n  S as ge,\n  g as Ge,\n  T as dt,\n  B as ee,\n  h as Be,\n  i as Z,\n  L as Te,\n  R as Xe,\n  j as ue,\n  k as se,\n  p as S,\n  l as K,\n  m as ft,\n  I as pe,\n  P as ut,\n  n as tt,\n  o as Le,\n  q as Ee,\n  r as je,\n  s as ht,\n  t as G,\n  u as vt,\n  Q as pt,\n  v as gt,\n  w as oe,\n  F as xe,\n  x as _t,\n  y as yt,\n  z as ae,\n  A as St,\n  H as $e,\n  J as wt,\n  K as Pt,\n  N as Ct,\n  O as xt,\n  U as bt,\n  W as it,\n  X as he,\n  Y as a,\n  Z as Mt,\n  _ as q,\n  $ as Se,\n  a0 as J,\n  a1 as Pe,\n  a2 as It,\n} from "../assets/vendor.js";', '')
        main_code = main_code.replace('window.Vector3 = p;', '')
    
    with open("js/interaction.js", "r", encoding="utf-8") as f:
        interaction_code = f.read()
    
    with open("css/style.css", "r", encoding="utf-8") as f:
        css_code = f.read()
    
    babylon_vars = """
var B = BABYLON;

var P = B.Color3;
var $ = B.Vector2;
var He = B.Matrix;
var Ye = B.Node;
var lt = B.Scene;
var ct = B.Engine;
var mt = B.MeshBuilder;
var p = B.Vector3;
var j = B.Animation;
var Ae = B.TransformNode;
var _ = B.DefaultRenderingPipeline;
var De = B.HDRCubeTexture;
var ge = B.SpotLight;
var Ge = B.DirectionalLight;
var dt = B.PBRMaterial;
var ee = B.StandardMaterial;
var Be = B.HemisphericLight;
var Z = B.PointLight;
var Te = B.Ray;
var Xe = B.RayHelper;
var ue = B.ArcRotateCamera;
var se = B.FreeCamera;
var S = B.EasingFunction;
var K = B.Color4;
var ft = B.Texture;
var pe = B.CubeTexture;
var ut = B.DynamicTexture;
var tt = B.GUI;
var Le = B.Sound;
var Ee = B.PostProcess;
var je = B.ParticleSystem;
var ht = B.Sprite;
var G = B.SpriteManager;
var vt = B.VertexData;
var pt = B.SubMesh;
var gt = B.Mesh;
var oe = B.ActionManager;
var xe = B.ExecuteCodeAction;
var _t = B.SetValueAction;
var yt = B.PropertyChangedAction;
var ae = B.InterpolateValueAction;
var St = B.PlayAnimationAction;
var $e = B.StopAnimationAction;
var wt = B.BoundingBox;
var Pt = B.BoundingInfo;
var Ct = B.Observable;
var xt = B.Observer;
var bt = B.AnimationGroup;
var it = B.SceneLoader;
var he = B.AssetsManager;
var a = B.Effect;
var Mt = B.RawTexture;
var q = B.ShaderMaterial;
var Se = B.Skeleton;
var J = B.Bone;
var Pe = B.SkinningManager;
var It = B.WebXRDefaultExperience;

window.Vector3 = p;
window.v = v;
window.i = i;
"""
    
    with open("index.html", "r", encoding="utf-8") as f:
        html_content = f.read()
    
    html_content = html_content.replace(
        '  <link rel="stylesheet" crossorigin="" href="css/style.css">',
        f'  <style>\n{css_code}\n  </style>'
    )
    
    html_content = html_content.replace(
        '  <script type="module" crossorigin="" src="js/main.js"></script>\n  <script type="module" crossorigin="" src="js/interaction.js"></script>\n  <link rel="modulepreload" crossorigin="" href="assets/vendor.js">',
        f'  <script>\n{vendor_code}\n{babylon_vars}\n{main_code}\n{interaction_code}\n  </script>'
    )
    
    html_content = html_content.replace('<link rel="modulepreload" crossorigin="" href="assets/vendor.js">', '')
    
    with open(os.path.join(dist_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html_content)
    
    shutil.copytree("assets", os.path.join(dist_dir, "assets"), dirs_exist_ok=True)
    shutil.copytree("draco", os.path.join(dist_dir, "draco"), dirs_exist_ok=True)
    shutil.copytree("res", os.path.join(dist_dir, "res"), dirs_exist_ok=True)
    
    print("打包完成！")
    print(f"请直接双击打开 {dist_dir}/index.html")
    print("（无需启动服务器，可完全离线使用）")

if __name__ == "__main__":
    bundle_project()
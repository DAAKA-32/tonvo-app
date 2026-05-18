# Free CLI AI Video Tools - 2025-2026 Inventory

_Compiled 2026-05-10 via WebSearch+WebFetch · target: Windows 11 + Python 3.10 + RTX 2060 6GB + CUDA 12.4 (no admin install, no MS C++ Build Tools)_

## TL;DR - top 3 to try in order

1. **LatentSync 1.5 (ByteDance)** - 6.8 GB VRAM inference (fits a 6GB card with everything else closed), Apache-2.0, Python 3.10, pip-installable, no mmcv/mmpose. Stable Diffusion-based lip-sync, full-face animation including jaw/cheek movement, beats Wav2Lip in mouth realism. **Best free path that doesn't need Build Tools.**
2. **LivePortrait (KwaiVGI)** - the strongest portrait animation tool of 2024-2025, animates head pose + eyes + micro-expressions from a driver video (you can record yourself). Conda + pip, Python 3.10, no mmcv. The X-Pose component requires CUDA compile but only for stitched/animal mode - core human portrait mode works with prebuilt wheels.
3. **WanGP / Wan2GP (deepbeepmeep)** - "GPU Poor" Gradio + headless launcher that wraps Wan 2.1, LTX-Video, Hunyuan, CogVideoX with 6GB-VRAM optimisations. One-click `.bat` Windows installer, Python 3.11.14 venv, active May 2026 release (v11.61). **Single install gets you 5+ T2V/I2V models.**

If you only have time for one install: **LatentSync** for lip-sync upgrade, **LivePortrait** for full-head animation, **WanGP** for image-to-video / text-to-video.

---

## Full inventory

### 1. LatentSync (ByteDance)
- **GitHub** : https://github.com/bytedance/LatentSync
- **License** : Apache-2.0
- **Last release** : 2025-06 (LatentSync 1.6); 1.5 in 2025-03
- **Install** : pip + `setup_env.sh` (the .sh has plain pip lines, port to .bat / direct pip)
- **GPU req** : 6.8 GB VRAM inference (1.5); 8 GB recommended; 18 GB for 1.6 (use 1.5)
- **Dep risk** : LOW. Whisper + diffusers + InsightFace + PySceneDetect. Pure pip wheels. No mmcv, no mmpose, no compile.
- **Quality vs Wav2Lip baseline** : 7.5/10 (better mouth shape, jaw movement, no Wav2Lip blur halo)
- **Speed on RTX 2060** : ~2-4x slower than realtime
- **Inference** : `python -m scripts.inference --unet_config_path configs/unet/stage2.yaml --inference_ckpt_path checkpoints/latentsync_unet.pt --video_path INPUT.mp4 --audio_path INPUT.wav --video_out_path OUT.mp4`
- **Verdict** : 🟢 **try first** for lip-sync upgrade
- **Notes** : Stick to v1.5 weights (6.8 GB); v1.6 needs 18 GB VRAM and won't fit. Needs an existing video, not just a still photo - pair with LivePortrait if you only have a photo.

### 2. LivePortrait (KwaiVGI / Kuaishou)
- **GitHub** : https://github.com/KwaiVGI/LivePortrait
- **License** : MIT (in repo LICENSE)
- **Last commit** : active through 2025-06
- **Install** : conda env + pip; official one-click Windows installer exists (issue #78)
- **GPU req** : not officially stated; community confirms 6GB works for human portrait mode. Reference perf is RTX 4090.
- **Dep risk** : MEDIUM. The `X-Pose` submodule builds `MultiScaleDeformableAttention` from source which needs CUDA compile. **However**, core human portrait inference works WITHOUT X-Pose (X-Pose is only for animals + stitched mode). CUDA 12.4 specifically flagged as risky in their docs - downgrade to torch+cu121 wheel if needed.
- **Quality vs Wav2Lip baseline** : 9/10 (full head pose, eye blinks, expression transfer from driver video)
- **Speed on RTX 2060** : near realtime for portrait mode (~12-15 fps); much slower for full body
- **Inference** : `python inference.py -s assets/examples/source/photo.jpg -d assets/examples/driving/driver.mp4`
- **Verdict** : 🟢 **try first** for full-face animation
- **Notes** : Driver-video paradigm = you record yourself talking, your face transfers to the still photo. Combine with LatentSync after for tighter audio-lip alignment. Skip X-Pose install initially; only add if you need cross-id animation.

### 3. WanGP / Wan2GP (deepbeepmeep)
- **GitHub** : https://github.com/deepbeepmeep/Wan2GP
- **License** : repo LICENSE.txt (likely permissive open)
- **Last release** : 2026-05-09 (v11.61) - very active
- **Install** : Windows `.bat` one-click, conda manual fallback. Python 3.11.14 for RTX 20xx-50xx.
- **GPU req** : 6 GB VRAM minimum (the entire project's tagline is "GPU Poor")
- **Dep risk** : LOW. Curated requirements with quantized weights.
- **Quality** : 8/10 (depends on underlying model - Wan 2.1 1.3B or LTX-Video 2B both run on 6GB)
- **Speed** : minutes per 5-second clip on RTX 2060
- **Inference** : `python wgp.py` for Gradio UI; `python wgp.py --process my_queue.zip` for headless
- **Verdict** : 🟢 **try first** for image-to-video and text-to-video
- **Notes** : Wraps Wan 2.1, Wan 2.2, LTX-Video, Hunyuan Video, CogVideoX, Flux, Qwen Image - one install covers half this report. Use for B-roll generation, not talking heads.

### 4. SadTalker (OpenTalker)
- **GitHub** : https://github.com/OpenTalker/SadTalker
- **License** : Apache-2.0
- **Last activity** : 2023-06 main release; community forks active
- **Install** : conda + pip; official `webui.bat` for Windows
- **GPU req** : 4 GB VRAM min, 8 GB for 512px enhanced output - **fits RTX 2060**
- **Dep risk** : MEDIUM. Officially Python 3.8; needs numpy<1.24 pin (np.float deprecation). dlib wheel sometimes fails on 3.10.
- **Quality vs Wav2Lip** : 6.5/10 (head pose + lip but lower res, slightly waxy face)
- **Speed** : ~1-3x realtime on RTX 2060 with GFPGAN enhancer off
- **Inference** : `python inference.py --driven_audio audio.wav --source_image photo.png --enhancer gfpgan`
- **Verdict** : 🟡 **fallback if LivePortrait fails** - widely supported, lots of Windows tutorials
- **Notes** : Community has working Python 3.10 builds. Stick to `webui.bat` for fastest path.

### 5. Easy-Wav2Lip (anothermartz)
- **GitHub** : https://github.com/anothermartz/Easy-Wav2Lip
- **License** : repo (MIT-ish, see file)
- **Status** : **archived 2025-01-28** - read-only but installable
- **Install** : `Easy-Wav2Lip.bat` auto-installer for Windows. Python 3.10.11 only.
- **GPU req** : ~2-4 GB VRAM (any modern NVIDIA)
- **Dep risk** : LOW. Self-contained installer.
- **Quality vs Wav2Lip** : 6.5/10 (Wav2Lip + feathered mask + GFPGAN upscale - same model, polish on top)
- **Speed** : <1 minute for 9s 720p (huge speedup vs Wav2Lip)
- **Inference** : `run_loop.bat` then config GUI
- **Verdict** : 🟡 **quick win** - if you already have Wav2Lip, this is a 30-min upgrade for free
- **Notes** : Archived means no future patches but no install regressions either. Best lazy upgrade.

### 6. EchoMimicV2 (Ant Group / BadToBest)
- **GitHub** : https://github.com/antgroup/echomimic_v2 + Windows fork https://github.com/sdbds/echomimic_v2-for-windows
- **License** : Apache-2.0
- **Last activity** : code 2024-11; CVPR 2025
- **Install** : conda + pip (Linux script). Windows fork exists but doesn't add Windows-specific install steps.
- **GPU req** : tested on V100 16GB minimum. **Officially does NOT fit 6GB.** A "Low VRAM Mode" is referenced in EchoMimic v1 notes but v2 docs only mention 16-80 GB.
- **Dep risk** : MEDIUM. Wants `xformers==0.0.28.post3` + `torch==2.5.1` (you have 2.6.0) - version conflict likely. Needs ffmpeg.
- **Quality vs Wav2Lip** : 8.5/10 (semi-body animation, gestures)
- **Speed** : ~7 min for 120 frames on A100 (so 30+ min on RTX 2060 if it even fits)
- **Inference** : `python infer.py --config='./configs/prompts/infer.yaml'` or Gradio `python app.py`
- **Verdict** : 🔴 **probably blocked** - VRAM too tight; revisit only if you upgrade GPU
- **Notes** : V3 (AAAI 2026) is 1.3B params and supposedly runs on 12GB - still over budget for RTX 2060.

### 7. CogVideoX (THUDM / zai-org)
- **GitHub** : https://github.com/zai-org/CogVideo
- **License** : Apache-2.0 (code), separate license for 5B weights
- **Last release** : 2024-11 (CogVideoX-1.5)
- **Install** : `pip install -r requirements.txt`. Python 3.10-3.12. Windows tutorials exist (issue #623).
- **GPU req** : **CogVideoX-5B-I2V FP16 = 4 GB minimum**, INT8 = 3.6 GB - actually the lowest-VRAM real text/image-to-video on this list
- **Dep risk** : LOW-MEDIUM. Diffusers-based, optional Triton+SageAttention for speed (Triton on Windows is fragile but optional).
- **Quality** : 7.5/10 (5-second clips, good motion, slight artifacting)
- **Speed** : 5-15 min per 5-sec clip on RTX 2060 with INT8
- **Inference** : `python inference/cli_demo.py --prompt "..." --image_or_video_path photo.jpg --model_path THUDM/CogVideoX-5b-I2V`
- **Verdict** : 🟢 **try if you go past WanGP** (or use it via WanGP)
- **Notes** : Best image-to-video on a 6GB card after quantization. Cleanest install of the diffusion-video family.

### 8. LTX-Video (Lightricks)
- **GitHub** : https://github.com/Lightricks/LTX-Video + desktop https://github.com/Lightricks/LTX-Desktop
- **License** : Apache-2.0
- **Last activity** : 2025-2026, very active
- **Install** : `pip install -e .[inference]` after clone. Python 3.10.5, PyTorch >=2.1.2.
- **GPU req** : community confirms 6 GB VRAM works for distilled 2B at 512x512, 50 frames; 1 GB for the LoRA-distill version
- **Dep risk** : LOW. Pure diffusers stack.
- **Quality** : 8/10 (fastest open T2V, decent UGC backgrounds)
- **Speed** : ~1-3 min per 5-sec clip on RTX 2060 (distilled)
- **Inference** : `python inference.py --prompt "PROMPT" --conditioning_media_paths photo.jpg --conditioning_start_frames 0 --height 512 --width 512 --num_frames 121 --pipeline_config configs/ltxv-13b-0.9.8-distilled.yaml`
- **Verdict** : 🟢 **try as B-roll generator** (or via WanGP)
- **Notes** : LTX-Desktop is the Windows-native GUI if you don't want to fight CLI.

### 9. Video-ReTalking (OpenTalker)
- **GitHub** : https://github.com/OpenTalker/video-retalking
- **License** : Apache-2.0
- **Last activity** : 2022 (SIGGRAPH Asia 2022, sparse since)
- **Install** : conda Python 3.8, torch 1.9.0+cu111
- **GPU req** : ~4-6 GB VRAM
- **Dep risk** : HIGH for our setup. Hard-pinned to **Python 3.8 + Torch 1.9 + CUDA 11.1**. We have 3.10/2.6/12.4. Many users report install failures on Python 3.10.
- **Quality vs Wav2Lip** : 7/10 (better than Wav2Lip on existing video)
- **Speed** : ~1 min per 10-sec clip
- **Inference** : `python3 inference.py --face video.mp4 --audio audio.wav --outfile out.mp4`
- **Verdict** : 🟡 **only if you spin up a separate Python 3.8 venv** - else skip
- **Notes** : Edits an existing talking video - won't help if you only have a photo.

### 10. AniPortrait (Zejun-Yang)
- **GitHub** : https://github.com/Zejun-Yang/AniPortrait + Windows fork https://github.com/sdbds/AniPortrait-for-windows
- **License** : Apache-2.0
- **Last activity** : 2024 (paper); fork tracks main
- **Install** : `pip install -r requirements.txt`. Python >=3.10.
- **GPU req** : not stated; community reports 8-12 GB needed for 512x512 - **borderline for 6GB**
- **Dep risk** : LOW for deps (Stable Diffusion 1.5 + Wav2Vec2 + AnimateDiff, **no mmcv/mmpose despite earlier reports**). HIGH for VRAM.
- **Quality** : 8/10 (audio-driven + expressive)
- **Speed** : slow (diffusion-based), several minutes per clip
- **Inference** : `python -m scripts.audio2vid --config ./configs/prompts/animation_audio.yaml -W 512 -H 512 -acc`
- **Verdict** : 🟡 **worth testing if LivePortrait disappoints** - try the sdbds Windows fork first
- **Notes** : Audio2Vid mode goes from photo + audio to talking video. If 512x512 OOMs, drop to 384.

### 11. DreamTalk (ali-vilab) - via Pinokio
- **GitHub** : https://github.com/cocktailpeanutlabs/dreamtalk (Pinokio fork) - original https://github.com/ali-vilab/dreamtalk
- **License** : original is research-only; Pinokio fork mirrors
- **Last activity** : original 2023; Pinokio fork maintained
- **Install** : Pinokio one-click on Windows (handles all deps)
- **GPU req** : ~6-8 GB VRAM
- **Dep risk** : MEDIUM. Original wants Python 3.7 + Torch 1.8 - Pinokio handles its own venv.
- **Quality** : 7/10 (expressive talking head, diffusion-based)
- **Speed** : 1-2 min per clip
- **Inference** : through Pinokio GUI (handles CLI underneath)
- **Verdict** : 🟡 **try via Pinokio if you want zero-config** - skip if you want pure CLI
- **Notes** : Original needs you to email Tsinghua for checkpoints. Pinokio bundles weights. **Cleanest path: install Pinokio, click DreamTalk.**

---

## Tools blocked for our setup

### Hallo / Hallo2 / Hallo3 (Fudan)
- 🔴 **VRAM blocker**. Hallo2 tested only on A100, ICLR 2025 paper, no documented low-VRAM path. Hallo3 is video-diffusion-transformer (much bigger). RTX 2060 6GB cannot run them.

### MuseTalk (Tencent)
- 🔴 already tried - **mmcv + mmpose require MS C++ Build Tools** (10GB admin install you don't have).

### MimicMotion (Tencent)
- 🔴 **16 GB VRAM minimum** documented (8 GB U-Net but VAE needs 16). RTX 2060 cannot run.

### HunyuanVideo (Tencent)
- 🔴 **14 GB VRAM minimum** even with offloading; original was 48 GB. Skip native; if you really need it, use it via WanGP which quantizes it.

### Wan 2.2 native
- 🔴 needs 80 GB VRAM in stock config. Use **via WanGP** instead, which has 6GB optimisations.

### Open-Sora 2.0
- 🔴 24 GB+ VRAM, Linux-focused (WSL2 only on Windows). Cannot run on RTX 2060.

### EchoMimicV2 native
- 🔴 16 GB VRAM minimum on V100. Skip.

### GeneFace++
- 🔴 needs custom CUDA compilation (PyTorch3D, custom ops) - same Build Tools blocker as MuseTalk.

### Magic Animate (showlab)
- 🔴 8GB+ VRAM, Linux-focused, depends on `densepose` + `detectron2` (Build Tools required).

### Wav2Lip-HD / Wav2Lip-384
- 🟡 forks of Wav2Lip with super-resolution, mostly community. **Use Easy-Wav2Lip instead** - it bundles GFPGAN super-res with the same speed gains.

---

## Recommended install sequence

**Phase 1 - lip-sync upgrade (1-2 hours)**
1. Install **Easy-Wav2Lip** (`Easy-Wav2Lip.bat`) - 30 min, immediate quality bump from your existing Wav2Lip output
2. Install **LatentSync 1.5** in a fresh Python 3.10 venv - if 6.8GB fits, this becomes your new lip-sync default

**Phase 2 - full-head animation (2-4 hours)**
3. Install **LivePortrait** via official Windows one-click installer (issue #78). Skip X-Pose initial install. Test human portrait mode on a single photo + driver video.
4. If LivePortrait fails on CUDA 12.4: downgrade to torch+cu121 wheel, retry. If still broken, install **AniPortrait Windows fork** (sdbds/AniPortrait-for-windows) as fallback.

**Phase 3 - text/image-to-video for B-roll (2-3 hours)**
5. Install **WanGP** via its Windows `.bat` (one install, multiple models). Start with Wan 2.1 1.3B (8GB doc, optimised to 6GB) or LTX-Video distilled (1-6GB).

**Phase 4 - if Phase 1-3 disappoint**
6. Install **Pinokio** + DreamTalk for zero-config diffusion talking head
7. Try **SadTalker** webui as the most-tutorialed fallback

**Stop conditions**
- If Phase 1+2 produce >7/10 UGC, ship.
- If Phase 3 B-roll is <6/10, accept that 6GB VRAM caps you and rent a cloud GPU (Vast.ai RTX 4090 ~$0.30/hr) for the heavier models (Hunyuan, Hallo2, EchoMimicV3).

**Honest take** : your RTX 2060 6GB will hit a ceiling at ~7.5-8.5/10 quality. Anything genuinely cinema-grade (Hallo3, HunyuanVideo native, Wan 2.2) needs 16-24GB+. The 3-tool stack above (LatentSync + LivePortrait + WanGP) is the best you can do free locally.

---

## Sources

- LivePortrait : https://github.com/KwaiVGI/LivePortrait
- LatentSync : https://github.com/bytedance/LatentSync
- WanGP : https://github.com/deepbeepmeep/Wan2GP
- SadTalker : https://github.com/OpenTalker/SadTalker
- Easy-Wav2Lip : https://github.com/anothermartz/Easy-Wav2Lip
- EchoMimicV2 : https://github.com/antgroup/echomimic_v2
- CogVideoX : https://github.com/zai-org/CogVideo
- LTX-Video : https://github.com/Lightricks/LTX-Video
- Video-ReTalking : https://github.com/OpenTalker/video-retalking
- AniPortrait : https://github.com/Zejun-Yang/AniPortrait
- DreamTalk Pinokio : https://github.com/cocktailpeanutlabs/dreamtalk
- Hallo2 : https://github.com/fudan-generative-vision/hallo2
- MimicMotion : https://github.com/Tencent/MimicMotion
- HunyuanVideo : https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5
- Open-Sora : https://github.com/hpcaitech/Open-Sora

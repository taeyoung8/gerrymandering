#!/bin/bash

#SBATCH --job-name=bw_ms
#SBATCH --output=bw_ms.txt
#SBATCH --nodes=1
#SBATCH --time=240:00
#SBATCH -p short-96core
#SBATCH --mail-type=BEGIN,END
#SBATCH --mail-user=nicholas.logozzo@stonybrook.edu

# Load Required Modules
module load anaconda/3
conda create -y -n bw_ms python=3.9
source activate bw_ms
pip install geopandas pandas numpy

# Run
cd /gpfs/projects/CSE416/Hornets
python3 box_and_whisker.py MS

# Cleanup
conda deactivate
conda remove -y -n bw_ms --all

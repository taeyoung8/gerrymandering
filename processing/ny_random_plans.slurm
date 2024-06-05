#!/bin/bash

#SBATCH --job-name=rp_ny
#SBATCH --output=rp_ny.txt
#SBATCH --nodes=1
#SBATCH --time=480:00
#SBATCH -p long-96core
#SBATCH --mail-type=BEGIN,END
#SBATCH --mail-user=nicholas.logozzo@stonybrook.edu

# Load Required Modules
module load anaconda/3
conda create -y -n rp_ny python=3.9
source activate rp_ny
pip install gerrychain==0.3.1 geopandas pandas

# Run
cd /gpfs/projects/CSE416/Hornets
python3 -m cProfile random_plans.py NY

# Cleanup
conda deactivate
conda remove -y -n rp_ny --all

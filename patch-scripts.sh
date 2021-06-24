#!/bin/bash
# Mac executable to sync scripts to Adobe installation paths.

END=[0m
BOLD=[1m
UNDERLINE=[4m
RED=[91m
GREEN=[92m
YELLOW=[93m

if [ $(uname) != Darwin ]; then
    echo
    echo ${RED}Unsupported platform.$END
    echo
    exit 1
fi

echo
echo ${BOLD}${UNDERLINE}Prepress Adobe Scripts$END
echo
echo ${BOLD}${YELLOW}WARNING$END
echo ${YELLOW}This command will replace all existing scripts, even the default ones.
echo Backup if necessary.$END
echo
echo 1. Illustrator
echo 2. Photoshop
echo A. All
echo
echo Q. Quit
echo
echo ${BOLD}Which scripts would you want to install:$END
read input

SOURCE_ROOT="$(cd `dirname $0` && pwd)"
SOURCE_STDLIB="$SOURCE_ROOT/.stdlib"

# In mac, localized directories always have `.localized` suffix.
patch_app() {
    local adobe_app=$1
    local source_scripts="$SOURCE_ROOT/$adobe_app Scripts"
    local success=false

    echo
    echo Patching $adobe_app:

    for app in /Applications/* ; do
        local appName=`basename $app`
        if [[ $appName == *Adobe* ]] && [[ $appName == *$adobe_app* ]] ; then
            local presets="$app/Presets"
            local localizedPresets="$presets.localized"
            if [ -d "$localizedPresets" ] ; then
                for preset in "$localizedPresets/"* ; do
                    success=true
                    patch_preset "$app" "$source_scripts" "$preset"
                done
            else
                success=true
                patch_preset "$app" "$source_scripts" "$presets"
            fi
        fi
    done
    if [ $success = false ] ; then
        echo ${RED}Not found.$END
    fi
}

patch_preset() {
    local app=$1
    local source_scripts=$2
    local target_root=$3
    local target_stdlib="$target_root/.stdlib"
    local target_scripts="$target_root/Scripts"
    local target_scripts_scratch="$target_scripts/.scratch"
    local target_scripts_libtest="$target_scripts/.lib-test"
    local target_scripts_readme="$target_scripts/README.md"

    echo - $GREEN$app$END

    # Deleting existing shared libraries
    if [ -d "$target_stdlib" ] ; then
        rm -rf "$target_stdlib"
    fi
    # Deleting existing scripts
    if [ -d "$target_scripts" ] ; then
        rm -rf "$target_scripts"
    fi
    # Copying new shared libraries and scripts
    mkdir "$target_scripts"
    cp -r "$source_scripts"/. "$target_scripts"
    mkdir "$target_stdlib"
    cp -r "$SOURCE_STDLIB"/. "$target_stdlib"
    # Cleaning up
    if [ -d "$target_scripts_scratch" ] ; then
        rm -rf "$target_scripts_scratch"
    fi
    if [ -d "$target_scripts_libtest" ] ; then
        rm -rf "$target_scripts_libtest"
    fi
    if [ -f "$target_scripts_readme" ] ; then
        rm -rf "$target_scripts_readme"
    fi
}

case $input in
    '1')
        patch_app Illustrator
        ;;
    '2')
        patch_app Photoshop
        ;;
    'a' | 'A')
        patch_app Illustrator
        patch_app Photoshop
        ;;
    'q' | 'Q')
        ;;
    *)
        echo
        echo ${RED}Unable to recognize input.$END
        echo
        exit 1
        ;;
esac

echo
echo Goodbye!
echo
exit 0
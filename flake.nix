{
    description = "Elm version of Rinne (pre-alpha) incremental game";

    inputs = {
        nixpkgs.url = "github:nixos/nixpkgs?ref=23.11";
        flake-utils.url = "github:numtide/flake-utils";
    };

    outputs = { self, nixpkgs, flake-utils, ... }:
      flake-utils.lib.eachDefaultSystem (system:
        let
            pkgs = nixpkgs.legacyPackages.${system};
        in
        {
            formatter.x86_64-linux = nixpkgs.legacyPackages.x86_64-linux.nixfmt-rfc-style;

            devShells.default = pkgs.mkShell {
                name = "elm-rinne";

                packages = with pkgs.elmPackages; [
                    elm
                    elm-doc-preview
                    elm-format
                    elm-optimize-level-2
                    elm-test
                    pkgs.caddy
                    pkgs.nodejs_20
                    pkgs.nodePackages.terser
                    pkgs.shellcheck
                ];

                shellHook =
                    ''
                    export project="$PWD"
                    export build="$project/.build"
                    export PATH="$project/bin:$PATH"

                    npm install --loglevel silent
                    '';
            };
        }
      );
}
